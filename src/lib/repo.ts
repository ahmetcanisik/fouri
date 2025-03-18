import { Octokit } from "@octokit/rest";
import { logger } from "../helpers/logger";

async function updateRepository(
  githubToken: string,
  { newURL }: { newURL?: string }
) {
  if (!newURL) {
    logger.info("No new URL provided, skipping update.");
    return;
  }

  const github = new Octokit({ auth: githubToken });

  const owner = "dizipaltv";
  const repo = "api";
  const filePath = "dizipal.json";

  try {
    // Dosyanın mevcut içeriğini al
    const { data: fileData } = await github.rest.repos.getContent({
      owner,
      repo,
      path: filePath,
    });

    if (!("content" in fileData)) {
      throw new Error("Invalid file content response");
    }

    const content = Buffer.from(fileData.content, "base64").toString("utf-8");
    const json = JSON.parse(content);

    if (json.currentSiteURL === newURL) {
      throw new Error(`Current Site url has no change, it's same ${newURL}`);
    }

    // currentSiteURL güncelle
    json.currentSiteURL = newURL;

    // Yeni içeriği encode et
    const updatedContent = Buffer.from(JSON.stringify(json, null, 2)).toString(
      "base64"
    );

    // Güncellenmiş dosyayı GitHub'a yükle
    await github.rest.repos.createOrUpdateFileContents({
      owner,
      repo,
      path: filePath,
      message: `Update currentSiteURL to ${newURL}`,
      content: updatedContent,
      sha: fileData.sha, // Dosyanın mevcut SHA bilgisini ekle
    });

    logger.success(`Updated currentSiteURL in ${filePath} to ${newURL}`);
  } catch (error) {
    logger.info(error);
  }
}

export default updateRepository;
