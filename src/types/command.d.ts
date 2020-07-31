type Command = () => Promise<void>;

type CommandExecuter = (command: Command) => Promise<void> | void;
