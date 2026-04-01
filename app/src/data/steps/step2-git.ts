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
            "You already used Git when you cloned this repo. Now you'll learn the day-to-day commands you'll use constantly.",
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
          content: "Open your terminal (in VS Code, press Ctrl+` or go to Terminal > New Terminal) and run:",
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
      ],
    },
    {
      title: "Make a Change",
      blocks: [
        {
          type: "text",
          content:
            "Now make any small change to a file. For example, open `app/src/app/page.tsx` and change the heading text to something fun. Save the file.",
        },
        {
          type: "text",
          content: "Now check what Git sees:",
        },
        {
          type: "terminal",
          content: "git status",
          label: "See what files have changed",
        },
        {
          type: "text",
          content:
            "You should see the file you changed listed in red under \"Changes not staged for commit.\" This means Git knows the file changed but you haven't told it to save the change yet.",
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
      ],
    },
    {
      title: "Verify on GitHub",
      blocks: [
        {
          type: "text",
          content:
            "Go to your repository on GitHub.com. You should see a banner saying your branch was recently pushed, with an option to create a \"Pull Request.\" A Pull Request (PR) is how you propose merging your changes into the main branch.",
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
