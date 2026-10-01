import React, { useState } from 'react';
import { X, Check, Copy, ExternalLink, Code2, Rocket, FileCheck, Layers } from 'lucide-react';

interface DeployModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DeployModal: React.FC<DeployModalProps> = ({ isOpen, onClose }) => {
  const [copiedWorkflow, setCopiedWorkflow] = useState(false);
  const [copiedScript, setCopiedScript] = useState(false);

  if (!isOpen) return null;

  const githubActionYaml = `name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: "pages"
  cancel-in-progress: false

jobs:
  build-and-deploy:
    environment:
      name: github-pages
      url: \${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Build static files
        run: npm run build

      - name: Setup Pages
        uses: actions/configure-pages@v5

      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: './dist'

      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
`;

  const npmDeploySnippet = `# 1. Build static production files (outputs to /dist)
npm run build

# 2. Push /dist to gh-pages branch (or drag & drop to any host)
npx gh-pages -d dist
`;

  const copyYaml = () => {
    navigator.clipboard.writeText(githubActionYaml);
    setCopiedWorkflow(true);
    setTimeout(() => setCopiedWorkflow(false), 2000);
  };

  const copyScript = () => {
    navigator.clipboard.writeText(npmDeploySnippet);
    setCopiedScript(true);
    setTimeout(() => setCopiedScript(false), 2000);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="GitHub.io deployment guide"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-950/60 backdrop-blur-xs"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl bg-white dark:bg-neutral-900 rounded-2xl shadow-2xl border border-neutral-200 dark:border-neutral-800 overflow-hidden flex flex-col max-h-[85vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-200 dark:border-neutral-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 flex items-center justify-center font-bold text-xs">
              gh
            </div>
            <div>
              <h2 className="text-sm font-bold text-neutral-900 dark:text-neutral-100">
                GitHub Pages (github.io) Architecture & Hosting
              </h2>
              <span className="text-[11px] text-neutral-500 dark:text-neutral-400">
                Static build evaluation &amp; 1-click deployment guide
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6 text-xs text-neutral-700 dark:text-neutral-300">
          {/* Architecture Evaluation Section */}
          <div className="p-4 rounded-xl bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-200 dark:border-neutral-700/60 space-y-2.5">
            <div className="flex items-center gap-2 text-neutral-900 dark:text-neutral-100 font-semibold text-xs">
              <Layers className="w-4 h-4 text-emerald-500" />
              <span>Evaluation: Is Pure HTML/CSS/JS Enough vs. This Setup?</span>
            </div>
            <p className="leading-relaxed text-neutral-600 dark:text-neutral-300">
              <strong>Yes, vanilla HTML/CSS/JS is technically capable</strong>, but as the hub grows with dozens of mini-tools, vanilla JS suffers from script namespace collisions, tedious DOM manipulation, and manual routing maintenance.
            </p>
            <p className="leading-relaxed text-neutral-600 dark:text-neutral-300">
              <strong>Why our Vite + Modular React Architecture is optimal:</strong>
            </p>
            <ul className="list-disc pl-4 space-y-1 text-neutral-600 dark:text-neutral-300">
              <li><strong>Zero Heavy Framework:</strong> No heavy runtime like Angular or server runtime. Compiles into 100% static, minified HTML/CSS/JS into the <code className="px-1 py-0.5 rounded bg-neutral-200 dark:bg-neutral-700 font-mono">/dist</code> folder.</li>
              <li><strong>Relative Paths Configured:</strong> We set <code className="px-1 py-0.5 rounded bg-neutral-200 dark:bg-neutral-700 font-mono">base: &apos;./&apos;</code> in <code className="px-1 py-0.5 rounded bg-neutral-200 dark:bg-neutral-700 font-mono">vite.config.ts</code> so the app runs smoothly in both custom domains and repository subpaths (e.g., <code className="px-1 py-0.5 rounded bg-neutral-200 dark:bg-neutral-700 font-mono">username.github.io/my-tools/</code>).</li>
              <li><strong>Zero 404s on Refresh:</strong> The hash router (<code className="px-1 py-0.5 rounded bg-neutral-200 dark:bg-neutral-700 font-mono">#/...</code>) works natively on GitHub Pages without requiring server rewrite hacks.</li>
              <li><strong>Modular Tool Registry:</strong> Adding a new tool is just dropping a component into <code className="px-1 py-0.5 rounded bg-neutral-200 dark:bg-neutral-700 font-mono">src/tools/</code> and adding 1 line to <code className="px-1 py-0.5 rounded bg-neutral-200 dark:bg-neutral-700 font-mono">TOOLS_REGISTRY</code>.</li>
            </ul>
          </div>

          {/* Automated GitHub Action Workflow */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-neutral-900 dark:text-neutral-100 flex items-center gap-1.5">
                <Rocket className="w-3.5 h-3.5 text-sky-500" />
                Automatic Deploy Workflow (<code className="font-mono text-[11px]">.github/workflows/deploy.yml</code>)
              </span>
              <button
                type="button"
                onClick={copyYaml}
                className="px-2.5 py-1 rounded bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-800 dark:text-neutral-200 font-medium text-[11px] flex items-center gap-1 transition-colors"
              >
                {copiedWorkflow ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                {copiedWorkflow ? 'Copied YAML' : 'Copy Workflow'}
              </button>
            </div>
            <pre className="p-3 bg-neutral-900 text-neutral-200 rounded-xl font-mono text-[11px] overflow-x-auto max-h-44 border border-neutral-800">
              {githubActionYaml}
            </pre>
          </div>

          {/* Quick Manual Deploy */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-neutral-900 dark:text-neutral-100 flex items-center gap-1.5">
                <Code2 className="w-3.5 h-3.5 text-amber-500" />
                Manual Deploy / gh-pages Command
              </span>
              <button
                type="button"
                onClick={copyScript}
                className="px-2.5 py-1 rounded bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-800 dark:text-neutral-200 font-medium text-[11px] flex items-center gap-1 transition-colors"
              >
                {copiedScript ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                {copiedScript ? 'Copied Commands' : 'Copy Commands'}
              </button>
            </div>
            <pre className="p-3 bg-neutral-900 text-neutral-200 rounded-xl font-mono text-[11px] overflow-x-auto border border-neutral-800">
              {npmDeploySnippet}
            </pre>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950/60 flex items-center justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900 font-medium text-xs hover:opacity-90 transition-opacity"
          >
            Close Guide
          </button>
        </div>
      </div>
    </div>
  );
};
