import css from "./b-styles.module.css";

export function B() {
    return (
        <div>
            <p>Hello</p>
            <h1 className={css.titleText}>Title B</h1>
        </div>
    );
}
