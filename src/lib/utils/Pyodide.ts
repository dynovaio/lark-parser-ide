import { loadPyodide, version as pyodideVersion } from 'pyodide';
import type { Writable } from 'svelte/store';

export type PyodideModule = Awaited<ReturnType<typeof loadPyodide>>;
export type CodeExecutionPromise = Awaited<ReturnType<PyodideModule['runPythonAsync']>>;

const PYODIDE_INDEX_URL = `https://cdn.jsdelivr.net/pyodide/v${pyodideVersion}/full/`;

const LARK_INSTALL_SCRIPT = `
import micropip
await micropip.install('lark')
`;

const LARK_IMPORT_SCRIPT = `
import lark
import json
import traceback
`;

const LARK_ENCODER_SCRIPT = `
class LarkEncoder(json.JSONEncoder):
    def default(self, o) -> object:
        if isinstance(o, lark.Tree):
            return {
                "type": "Tree",
                "data": o.data,
                "children": o.children,
            }
        elif isinstance(o, lark.Token):
            return {
                "type": "Token",
                "type_name": o.type,
                "value": o.value,
            }
        return super().default(o)
`;

export const setupPyodide = async (message: Writable<string>, progress: Writable<number>) => {
  progress.set(0);
  message.set('Loading Pyodide...');
  const pyodide = await loadPyodide({
    indexURL: PYODIDE_INDEX_URL
  });

  progress.set(25);
  message.set('Installing micropip...');
  await pyodide.loadPackage('micropip');

  progress.set(50);
  message.set('Installing Lark Parser...');
  await pyodide.runPythonAsync(LARK_INSTALL_SCRIPT);
  await pyodide.runPythonAsync(LARK_IMPORT_SCRIPT);
  await pyodide.runPythonAsync(LARK_ENCODER_SCRIPT);

  progress.set(75);
  message.set('Setup complete.');

  progress.set(100);
  return pyodide;
};
