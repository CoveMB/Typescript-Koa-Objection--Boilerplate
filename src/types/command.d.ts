export type Command = () => void;

export type CommandExecuter = (command: Command) => Promise<void> | void;
