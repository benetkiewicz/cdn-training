export interface LessonCardProps {
    title: string;
    subtitle: string;
    id: string;
    isAccessGranted: boolean;
}

export const LessonCard = ({ title, subtitle, id, isAccessGranted }: LessonCardProps) => {
    return (
        <div class="lesson-card">
            {!isAccessGranted && <span class="premium-badge" title={"Premium Content"}>🔒</span>}
            <h3>{title}</h3>
            <p>{subtitle}</p>
            <p>&nbsp;</p>
            <a href={`/lessons/${id}`} class={isAccessGranted ? "button" : "button disabled"}>
                Begin
            </a>
        </div>
    );
};
