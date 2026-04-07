import { StepData } from "../types";

export const step2Git: StepData = {
  id: "git-basics",
  stepNumber: 2,
  title: "Git Basics",
  subtitle: "Learn to create branches, save your work, and push changes to GitHub.",
  estimatedMinutes: 10,
  sections: [
    {
      title: "Why Git?",
      blocks: [
        {
          type: "text",
          content:
            "Git is a version control system — think of it as an unlimited \"undo\" button for your entire project. Every time you \"commit,\" you save a snapshot of your work that you can always go back to. GitHub is the website where your code is stored online, so you have a backup and can collaborate with others.",
        },
        {
          type: "callout",
          variant: "tip",
          content:
            "Your coding agent already used Git behind the scenes when it cloned this repo for you. Now you'll learn the day-to-day commands you'll use yourself.",
        },
      ],
    },
    {
      title: "Open a Second Terminal",
      blocks: [
        {
          type: "text",
          content:
            "Your dev server is running in one terminal — leave it running! You can open a second terminal for Git commands. In VS Code, click the `+` button in the terminal panel to open a new one.",
        },
        {
          type: "text",
          content:
            "In your new terminal, navigate to the project root — Git commands need to run from the folder that contains the `.git` directory:",
        },
        {
          type: "terminal",
          content: "cd ..",
          label: "Navigate to the project root (if you're in app/)",
        },
        {
          type: "callout",
          variant: "tip",
          content:
            "You can have as many terminals open as you want. Keep one for the dev server and use others for running commands. You'll use this pattern constantly.",
        },
      ],
    },
    {
      title: "Create a Branch",
      blocks: [
        {
          type: "text",
          content:
            "A branch is like a copy of your project where you can make changes without affecting the original. The main branch (usually called `main`) is the \"official\" version. You create a new branch for each feature or experiment.",
        },
        {
          type: "text",
          content: "In your second terminal, run:",
        },
        {
          type: "terminal",
          content: "git checkout -b my-first-branch",
          label: "Create and switch to a new branch",
        },
        {
          type: "text",
          content:
            "This creates a new branch called `my-first-branch` and switches you to it. You can name branches whatever you want — just keep them lowercase with dashes.",
        },
        {
          type: "text",
          content:
            "Look at the bottom-left corner of VS Code — you should see the branch name changed from `main` to `my-first-branch`. This is how you can always tell which branch you're on.",
        },
        {
          type: "image",
          content: "/branch-indicator.png",
          label: "The branch name in the VS Code status bar",
        },
      ],
    },
    {
      title: "Make a Small UI Change",
      blocks: [
        {
          type: "text",
          content:
            "Let's give Git something to track. We're going to update the button text on your home page from \"Start the Tutorial\" to something that feels more like yours. Ask your AI agent:",
        },
        {
          type: "code",
          language: "text",
          label: "Tell your AI agent",
          content:
            "On the home page (app/src/app/page.tsx), change the button text from \"Start the Tutorial\" to \"Let's Build Something\" (or any text you prefer).",
        },
        {
          type: "text",
          content:
            "Once your agent makes the change, switch back to your browser at http://localhost:3000 — you should see the new button text appear instantly thanks to hot reload. Now check what Git sees:",
        },
        {
          type: "terminal",
          content: "git status",
          label: "See what files have changed",
        },
        {
          type: "text",
          content:
            "You should see something like this — files you changed listed in red under \"Changes not staged for commit.\" This means Git knows the files changed but you haven't told it to save them yet.",
        },
        {
          type: "image",
          content: "/git-status-example.png",
          label: "Example output of git status",
        },
        {
          type: "checklist",
          content: "",
          items: [
            "\"Changes not staged for commit\" (red) — Files that existed before and have been modified. Git sees the changes but won't save them until you stage them.",
            "\"Untracked files\" (red) — Brand new files that Git has never seen before. You need to add them before Git will track them.",
          ],
        },
      ],
    },
    {
      title: "Stage, Commit, and Push",
      blocks: [
        {
          type: "text",
          content:
            "Saving changes in Git is a two-step process: first you \"stage\" (select) the files you want to save, then you \"commit\" (save the snapshot with a message). Finally, you \"push\" to upload your changes to GitHub.",
        },
        {
          type: "terminal",
          content:
            "git add .\ngit commit -m \"my first commit\"\ngit push -u origin my-first-branch",
          label: "Stage, commit, and push",
        },
        {
          type: "checklist",
          content: "",
          items: [
            "`git add .` — Stages all changed files (the dot means \"everything\")",
            "`git commit -m \"message\"` — Saves a snapshot with a description of what you did",
            "`git push -u origin my-first-branch` — Uploads your branch to GitHub",
          ],
        },
        {
          type: "callout",
          variant: "info",
          content:
            "The `-u origin` part is only needed the first time you push a new branch. After that, just `git push` is enough.",
        },
        {
          type: "text",
          content:
            "Here's what the full process looks like in your terminal:",
        },
        {
          type: "image",
          content: "/Screenshot 2026-04-03 062541.png",
          label: "Running git add, commit, and push in the terminal",
        },
        {
          type: "text",
          content:
            "Notice the output after `git commit` — it tells you the branch name, how many files changed, and how many lines were added or removed. The `create mode` lines mean Git is tracking brand new files for the first time.",
        },
        {
          type: "callout",
          variant: "tip",
          content:
            "**First time pushing?** A browser window may pop up asking you to authorize Git to access GitHub — click \"Authorize\" and you're set. Mac users who already ran `gh auth login` during setup won't see this popup since auth is already configured.",
        },
      ],
    },
    {
      title: "Verify on GitHub",
      blocks: [
        {
          type: "text",
          content:
            "Go to your repository on GitHub.com. To see your new branch, click the branch dropdown (it usually says `main`) near the top-left of the page. You should see `my-first-branch` in the list.",
        },
        {
          type: "text",
          content:
            "You may also see a yellow banner at the top saying your branch was recently pushed, with a green \"Compare & pull request\" button. A Pull Request (PR) is how you propose merging your changes into the main branch.",
        },
        {
          type: "callout",
          variant: "tip",
          content:
            "You don't need to create a PR right now — just know that's the normal workflow: create a branch, make changes, push, create a PR, then merge.",
        },
      ],
    },
    {
      title: "Essential Git Commands Reference",
      blocks: [
        {
          type: "checklist",
          content: "",
          items: [
            "`git status` — See what's changed",
            "`git add .` — Stage all changes",
            "`git commit -m \"message\"` — Save a snapshot",
            "`git push` — Upload to GitHub",
            "`git pull` — Download latest changes from GitHub",
            "`git checkout main` — Switch back to the main branch",
            "`git checkout -b new-branch` — Create and switch to a new branch",
          ],
        },
      ],
    },
  ],
};
