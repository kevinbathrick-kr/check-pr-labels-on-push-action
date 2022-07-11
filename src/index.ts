import * as core from "@actions/core";
import * as github from "@actions/github";
import { GitHub } from "@actions/github/lib/utils";

async function run() {
    const token = core.getInput("github-token", { required: true });
    const octokit = github.getOctokit(token);
    const labelNames = await getPullRequestLabelNames(octokit);
    core.setOutput("result", labelNames);
}

async function getPullRequestLabelNames(
    octokit: InstanceType<typeof GitHub>
): Promise<string[]> {
    const owner = github.context.repo.owner;
    const repo = github.context.repo.repo;
    const commit_sha = github.context.sha;

    const response =
        await octokit.rest.repos.listPullRequestsAssociatedWithCommit({
            owner,
            repo,
            commit_sha,
        });

    const pr = response.data.length > 0 && response.data[0];
    return pr ? pr.labels.map((label) => label.name || "") : [];
}

run().catch((err) => {
    core.setFailed(err.message);
});
