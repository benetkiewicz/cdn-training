export interface LessonCardProps {
    title: string;
    subtitle: string;
    id: number;
}

export const LessonCard = ({ title, subtitle, id }: LessonCardProps) => {
    return (
        <div class="lesson-card">
            <h3>{title}</h3>
            <p>{subtitle}</p>
            <br />
            <a href={`/lessons/lesson${id}`} class="button">
                Begin
            </a>
        </div>
    );
};
