import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      action,
      githubToken,
      projectName = "aiprogram-app",
      customRepoName,
      isPrivate = true,
      description = "Opprettet med AI Program Builder",
      commitMessage = "Initial commit fra AI Program Builder",
      files = [],
    } = body;

    const token = (githubToken || "").trim();
    if (!token) {
      return NextResponse.json(
        { error: "Vennligst oppgi en GitHub Personal Access Token for å koble til din GitHub-konto." },
        { status: 400 }
      );
    }

    const ghHeaders = {
      Authorization: `Bearer ${token}`,
      Accept: "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28",
      "User-Agent": "AIProgram-Builder",
    };

    // 1. Verifiser bruker via GitHub API
    const userRes = await fetch("https://api.github.com/user", { headers: ghHeaders });
    if (!userRes.ok) {
      const errData = await userRes.json().catch(() => ({}));
      return NextResponse.json(
        {
          error: "Ugyldig GitHub-token. Sjekk at tokenet er riktig og har 'repo'-tillatelse.",
          details: errData.message || userRes.statusText,
        },
        { status: 401 }
      );
    }

    const userData = await userRes.json();
    const owner = userData.login;

    // Hvis dette kun er en verifiseringsforespørsel, returner brukerprofil
    if (action === "verify") {
      return NextResponse.json({
        success: true,
        user: {
          login: userData.login,
          name: userData.name || userData.login,
          avatar_url: userData.avatar_url,
          html_url: userData.html_url,
        },
      });
    }

    // 2. Klargjør repo-navn
    const rawRepoName = customRepoName || projectName;
    const sanitizedRepoName = rawRepoName
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9-_]/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "") || "aiprogram-prosjekt";

    // 3. Sjekk om repo allerede eksisterer
    let repoRes = await fetch(`https://api.github.com/repos/${owner}/${sanitizedRepoName}`, {
      headers: ghHeaders,
    });

    let defaultBranch = "main";

    if (repoRes.status === 404) {
      // Opprett repository
      const createRes = await fetch("https://api.github.com/user/repos", {
        method: "POST",
        headers: ghHeaders,
        body: JSON.stringify({
          name: sanitizedRepoName,
          description: description || "Bygget med AI Program Builder (aiprogram.no)",
          private: Boolean(isPrivate),
          auto_init: true, // Initier med README så vi har en initial commit og branch
        }),
      });

      if (!createRes.ok) {
        const createErr = await createRes.json().catch(() => ({}));
        return NextResponse.json(
          {
            error: `Kunne ikke opprette repo '${sanitizedRepoName}' på GitHub.`,
            details: createErr.message || createRes.statusText,
          },
          { status: createRes.status }
        );
      }

      const createdData = await createRes.json();
      defaultBranch = createdData.default_branch || "main";

      // Gi GitHub 1.2 sekunder til å initialisere git-treet
      await new Promise((resolve) => setTimeout(resolve, 1200));
    } else if (repoRes.ok) {
      const existingData = await repoRes.json();
      defaultBranch = existingData.default_branch || "main";
    }

    // 4. Hent nyeste commit SHA for default branch
    let refRes = await fetch(
      `https://api.github.com/repos/${owner}/${sanitizedRepoName}/git/ref/heads/${defaultBranch}`,
      { headers: ghHeaders }
    );

    // Hvis main ikke finnes, prøv master
    if (!refRes.ok && defaultBranch === "main") {
      const masterRes = await fetch(
        `https://api.github.com/repos/${owner}/${sanitizedRepoName}/git/ref/heads/master`,
        { headers: ghHeaders }
      );
      if (masterRes.ok) {
        refRes = masterRes;
        defaultBranch = "master";
      }
    }

    let latestCommitSha: string | null = null;
    let baseTreeSha: string | null = null;

    if (refRes.ok) {
      const refData = await refRes.json();
      latestCommitSha = refData.object.sha;

      // Hent commit for å finne base tree
      const commitRes = await fetch(
        `https://api.github.com/repos/${owner}/${sanitizedRepoName}/git/commits/${latestCommitSha}`,
        { headers: ghHeaders }
      );
      if (commitRes.ok) {
        const commitData = await commitRes.json();
        baseTreeSha = commitData.tree.sha;
      }
    }

    // 5. Opprett git blobs / tree for alle prosjektfiler
    const validFiles: Array<{ path: string; content: string }> = Array.isArray(files) && files.length > 0
      ? files
      : [
          {
            path: "README.md",
            content: `# ${projectName}\n\nBygget med AI Program Builder.\n`,
          },
        ];

    // Bygg tree items
    const treeItems = validFiles.map((file) => {
      const cleanPath = file.path.startsWith("/") ? file.path.slice(1) : file.path;
      return {
        path: cleanPath,
        mode: "100644",
        type: "blob",
        content: file.content ?? "",
      };
    });

    const createTreeRes = await fetch(
      `https://api.github.com/repos/${owner}/${sanitizedRepoName}/git/trees`,
      {
        method: "POST",
        headers: ghHeaders,
        body: JSON.stringify({
          base_tree: baseTreeSha || undefined,
          tree: treeItems,
        }),
      }
    );

    if (!createTreeRes.ok) {
      const treeErr = await createTreeRes.json().catch(() => ({}));
      return NextResponse.json(
        {
          error: "Kunne ikke opprette filtre på GitHub.",
          details: treeErr.message || createTreeRes.statusText,
        },
        { status: 500 }
      );
    }

    const treeData = await createTreeRes.json();
    const newTreeSha = treeData.sha;

    // 6. Opprett ny commit
    const createCommitRes = await fetch(
      `https://api.github.com/repos/${owner}/${sanitizedRepoName}/git/commits`,
      {
        method: "POST",
        headers: ghHeaders,
        body: JSON.stringify({
          message: commitMessage || `Oppdatering fra AI Program Builder (${new Date().toLocaleString("no-NO")})`,
          tree: newTreeSha,
          parents: latestCommitSha ? [latestCommitSha] : [],
        }),
      }
    );

    if (!createCommitRes.ok) {
      const commitErr = await createCommitRes.json().catch(() => ({}));
      return NextResponse.json(
        {
          error: "Kunne ikke opprette commit på GitHub.",
          details: commitErr.message || createCommitRes.statusText,
        },
        { status: 500 }
      );
    }

    const commitResult = await createCommitRes.json();
    const newCommitSha = commitResult.sha;

    // 7. Oppdater grenreferansen (refs/heads/main)
    const updateRefRes = await fetch(
      `https://api.github.com/repos/${owner}/${sanitizedRepoName}/git/refs/heads/${defaultBranch}`,
      {
        method: "PATCH",
        headers: ghHeaders,
        body: JSON.stringify({
          sha: newCommitSha,
          force: true,
        }),
      }
    );

    if (!updateRefRes.ok) {
      // Hvis referansen ikke fantes fra før, opprett den
      await fetch(
        `https://api.github.com/repos/${owner}/${sanitizedRepoName}/git/refs`,
        {
          method: "POST",
          headers: ghHeaders,
          body: JSON.stringify({
            ref: `refs/heads/${defaultBranch}`,
            sha: newCommitSha,
          }),
        }
      );
    }

    const finalRepoUrl = `https://github.com/${owner}/${sanitizedRepoName}`;

    return NextResponse.json({
      success: true,
      repoUrl: finalRepoUrl,
      owner,
      repoName: sanitizedRepoName,
      branch: defaultBranch,
      filesCount: validFiles.length,
      message: `Fullført! ${validFiles.length} filer ble pushet til ${finalRepoUrl}`,
    });
  } catch (error: any) {
    console.error("Feil ved GitHub eksport:", error);
    return NextResponse.json(
      { error: "Kunne ikke fullføre eksport til GitHub.", details: error?.message },
      { status: 500 }
    );
  }
}
