export type Grammar = {
  uri?: string;
  content?: string;
  error?: string;
};

export const GRAMMAR_TEMPLATE: Readonly<Grammar> = Object.freeze({
  content: '',
  error: ''
});

export const loadGrammarFromUri = async (uri: string): Promise<Grammar> => {
  try {
    const response = await fetch(uri);
    if (!response.ok) {
      console.error(`Failed to load grammar from ${uri}: ${response.statusText}`);
      return {
        uri,
        content: '',
        error: `Failed to load grammar: ${response.statusText}`
      };
    }
    const content = await response.text();

    if (!content) {
      console.error(`Grammar content is empty for ${uri}`);
      return {
        uri,
        content: '',
        error: 'Grammar content is empty'
      };
    }

    return { uri, content };
  } catch (error) {
    console.error(`Error loading grammar: ${error}`);
    return {
      uri,
      content: '',
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
};

export const loadGrammar = async (grammar: Grammar, force: boolean = false): Promise<Grammar> => {
  if (!grammar.uri) {
    console.warn('No grammar URI provided.');
    return grammar;
  }

  const isAlreadyLoaded = !!grammar.content || !!grammar.error;
  if (isAlreadyLoaded && !force) {
    console.warn(`Grammar already loaded from ${grammar.uri}`);
    return grammar;
  }

  return await loadGrammarFromUri(grammar.uri);
};

export const downloadGrammar = async (fileName: string, grammar: Grammar): Promise<Grammar> => {
  if (!grammar.content) {
    console.warn('No content to download for the grammar.');
    return grammar;
  }

  const blob = new Blob([grammar.content], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${fileName}.lark`;
  a.style.display = 'none';

  document.body.appendChild(a);

  try {
    a.click();
  } catch (error) {
    console.warn('Error during download click:', error);
  } finally {
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  return grammar;
};
