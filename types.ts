
export type ViewMode = 'encrypt' | 'decrypt';

export interface CryptoKeys {
  pub: string;
  priv: string;
}

/**
 * Added ProjectFile interface to represent individual code files within a mini-program project.
 * Used for AI generation and UI rendering.
 */
export interface ProjectFile {
  name: string;
  path: string;
  content: string;
  description?: string;
  language: "javascript" | "xml" | "css" | "json";
}

/**
 * Added MiniProgramProject interface to represent the full structure of the generated mini-program.
 * Matches the response schema defined in the Gemini API service.
 */
export interface MiniProgramProject {
  title: string;
  description: string;
  appConfig: string;
  files: ProjectFile[];
}
