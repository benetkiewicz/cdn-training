export interface NameDisplayProps {
    name: string;
}

export const NameDisplay = ({name}: NameDisplayProps) => {
    return <div>{name}</div>;
}