export interface LessonCardProps {
    title: string;
    subtitle: string;
    link?: string;
}

export const LessonCard = ({ title, subtitle, link = "lesson" }: LessonCardProps) => {
    return (
        <div class="lesson-card">
            <h3>{title}</h3>
            <p>{subtitle}</p>
            <br />
            <a href={link} class="button">
                Begin
            </a>
        </div>
    );
};
