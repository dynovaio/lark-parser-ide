import { loadPyodide, version as pyodideVersion } from 'pyodide';

export type PyodideModule = Awaited<ReturnType<typeof loadPyodide>>;
export type CodeExecutionPromise = Awaited<ReturnType<PyodideModule['runPythonAsync']>>;

type OnReadyFunction = (pyodide: PyodideModule) => void;
type LogFunction = (message: string) => void;

export interface ISetupPyodideParams {
  onReady: OnReadyFunction;
  log: LogFunction;
}
export const setupPyodide = async (params: ISetupPyodideParams) => {
  params.log('Loading Pyodide');

  const pyodide = await loadPyodide({
    indexURL: `https://cdn.jsdelivr.net/pyodide/v${pyodideVersion}/full/`
  });

  params.log('Installing micropip');
  await pyodide.loadPackage('micropip');

  params.log('Downloading & Installing Lark');
  await pyodide.runPythonAsync("import micropip; await micropip.install('lark');");
  await pyodide.runPythonAsync('import lark');
  await pyodide.runPythonAsync(`
import json
from typing import Optional
from lark import Tree, Token

class LarkEncoder(json.JSONEncoder):
    def default(self, o: Optional[object]) -> object:
        if isinstance(o, Tree):
            return {
                "type": "Tree",
                "data": o.data,
                "children": o.children,
            }
        elif isinstance(o, Token):
            return {
                "type": "Token",
                "type_name": o.type,
                "value": o.value,
            }
        return super().default(o)
  `);
  params.onReady(pyodide);
};
