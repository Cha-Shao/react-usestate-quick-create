import * as vscode from 'vscode';

// 辅助函数：将字符串转换为小驼峰 (e.g., "login modal" -> "loginModal")
function toCamelCase(str: string): string {
    return str
        .trim()
        .toLowerCase()
        .replace(/[^a-zA-Z0-9]+(.)/g, (m, chr) => chr.toUpperCase());
}

// 辅助函数：首字母大写 (用于 set 函数，e.g., "loginModal" -> "LoginModal")
function capitalize(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

// 核心解析逻辑
function parseStateInput(input: string) {
    // 按照逗号分割，并去除两端空格
    const parts = input.split(',').map(p => p.trim());
    
    if (parts.length === 0 || parts[0] === '') {
        return null;
    }

    let nameInput = parts[0];
    let typeInput = '';
    let valueInput = '';

    if (parts.length === 2) {
        // 情况 A: "login modal, false" -> name, value (自动推导类型)
        valueInput = parts[1];
    } else if (parts.length >= 3) {
        // 情况 B: "data, DataInterface, null" -> name, type, value
        typeInput = parts[1];
        // 如果值里面也包含逗号，把它重新接回来
        valueInput = parts.slice(2).join(', '); 
    }

    // 1. 处理变量名
    const varName = toCamelCase(nameInput);
    const setVarName = `set${capitalize(varName)}`;

    // 2. 智能类型推导与默认值处理
    let finalType = typeInput;
    let finalValue = valueInput || 'undefined';

    // 如果用户没写类型，尝试根据值进行推导
    if (!finalType && valueInput) {
        if (valueInput === 'true' || valueInput === 'false') {
            finalType = 'boolean';
        } else if (!isNaN(Number(valueInput)) && valueInput !== '') {
            finalType = 'number';
        } else if (valueInput.startsWith('"') || valueInput.startsWith("'") || valueInput.startsWith('`')) {
            finalType = 'string';
        } else if (valueInput === '[]') {
            finalType = 'any[]'; // 默认 any[]，用户指定了则用指定的
        }
    }

    // 如果值是 null，自动给类型加上 | null
    if (finalType && valueInput === 'null' && !finalType.includes('| null')) {
        finalType = `${finalType} | null`;
    }

    // 构造最终生成的代码
    // 如果有类型：const [data, setData] = useState<Type>(value);
    // 如果没类型：const [data, setData] = useState(value);
    const typeSnippet = finalType ? `<${finalType}>` : '';
    
    return `const [${varName}, ${setVarName}] = useState${typeSnippet}(${finalValue});`;
}

export function activate(context: vscode.Context) {
    let disposable = vscode.commands.registerCommand('react-usestate-quick-create.createState', async () => {
        // 获取当前活跃的编辑器
        const editor = vscode.window.activeTextEditor;
        if (!editor) {
            return;
        }

        // 弹出输入框
        const input = await vscode.window.showInputBox({
            placeHolder: "e.g., login modal, false 或 data, DataInterface, null",
            prompt: "输入: 变量名, [类型], 默认值 (中间用逗号隔开)",
            ignoreFocusOut: true
        });

        if (!input) { return; }

        const generatedCode = parseStateInput(input);
        if (!generatedCode) {
            vscode.window.showErrorMessage('输入格式不正确！');
            return;
        }

        // 插入代码到当前光标位置
        editor.edit(editBuilder => {
            const position = editor.selection.active;
            editBuilder.insert(position, generatedCode);
        });
    });

    context.subscriptions.push(disposable);
}

export function deactivate() {}