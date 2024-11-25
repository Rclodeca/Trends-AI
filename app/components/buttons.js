"use client";
import { GitHubIcon } from "./icons";

export function GithubButton() {
    return (
      <button
        onClick={() => window.open('https://github.com/Rclodeca/Trends-AI', '_blank')}
        className="flex items-center space-x-2 bg-gray-800 text-white px-4 py-2 rounded hover:bg-gray-700"
      >
        <GitHubIcon />
        <span>GitHub</span>
      </button>
    );
  }
  