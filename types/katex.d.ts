declare module 'katex' {
    interface KatexOptions {
        displayMode?: boolean;
        throwOnError?: boolean;
        errorColor?: string;
        strict?: boolean;
        trust?: boolean;
        macros?: { [key: string]: string };
    }

    function render(expression: string, element: HTMLElement, options?: KatexOptions): void;
    
    export default {
        render
    };
}
