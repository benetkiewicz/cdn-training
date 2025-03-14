export interface LessonCardProps {
    title: string;
    subtitle: string;
    id: string;
}

export const LessonCard = ({ title, subtitle, id }: LessonCardProps) => {
    return (
        <div class="lesson-card">
            <h3>{title}</h3>
            <p>{subtitle}</p>
            <p>&nbsp;</p>
            <a href={`/lessons/${id}`} class="button">
                Begin
            </a>
        </div>
    );
};
