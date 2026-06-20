# React useState Quick Create

一个专为 React/TypeScript 开发者设计的 VS Code 快捷插件。通过简单的逗号分隔输入，智能、快速地生成带有类型推导和驼峰命名转换的 `useState` 样板代码。

## 功能特点 (Features)

- **智能命名转换**：输入空格分隔的名称（如 `login modal`），自动转换为小驼峰变量名 `loginModal` 以及大驼峰 Setter 函数 `setLoginModal`。
- **智能类型推导**：支持省略类型，根据初始值自动推导 `boolean`、`number`、`string` 等基础类型。
- **复杂类型支持**：完美支持自定义 Interface、泛型以及联合类型（如 `DataInterface | null`）。

## 使用方法 (Usage)

1. 在 `.tsx` 或 `.jsx` 文件中，将光标移动到想要插入代码的位置。
2. 按下 **`F1`**（或 `Ctrl+Shift+P` / `Cmd+Shift+P`）打开命令面板。
3. 输入并选择 **`Create React useState`**。
4. 在弹出的输入框中按照以下格式输入并回车：

### 示例 1：基础自动类型推导
* **输入**: `login modal, false`
* **生成**: `const [loginModal, setLoginModal] = useState<boolean>(false);`

### 示例 2：显式指定接口类型与 Null 默认值
* **输入**: `data, DataInterface, null`
* **生成**: `const [data, setData] = useState<DataInterface | null>(null);`

### 示例 3：数组与自定义类型
* **输入**: `data list, DI[], []`
* **生成**: `const [dataList, setDataList] = useState<DI[]>([]);`

## 快捷键配置 (Optional)

如果你觉得每次按 F1 太麻烦，可以在 VS Code 的 `keybindings.json` 中为其绑定快捷键。例如绑定为 `Ctrl+Alt+S`：

```json
{
  "key": "ctrl+alt+s",
  "command": "react-usestate-quick-create.createState",
  "when": "editorTextFocus"
}