import { loadPyodide, version as pyodideVersion } from 'pyodide';


export const setupPyodide = async (callback: Function, log: Function) => {
    log('Loading Pyodide');

    const pyodide = await loadPyodide({
        indexURL: `https://cdn.jsdelivr.net/pyodide/v${pyodideVersion}/full/`
    });

    log('Installing micropip');
    await pyodide.loadPackage('micropip');

    log('Downloading & Installing Lark');
    await pyodide.runPythonAsync("import micropip; await micropip.install('lark');");
    await pyodide.runPythonAsync('import lark');

    callback(pyodide);
}
