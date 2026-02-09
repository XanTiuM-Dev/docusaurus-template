import React from "react";
import clsx from "clsx"
import styles from '@site/src/components/headerBlock.module.css'

export type HeaderProps = {
    title?: string;
    flag?: string;
    icon?: React.ReactNode;
    className?: string;
};

const HeaderBlock: React.FC<HeaderProps> = ({ title, flag, icon, className }) => {
    if (!title && !flag && !icon) return null;
    return (
        <div className={clsx(styles.headerBlock, className)}>
            {(icon || title) && (<div className={styles.headerLeft}>
                {icon && (<span className={styles.headerBlockIcon}>{icon}</span>)}
                {title && (<span className={styles.headerBlockTitle}>{title}</span>)}
            </div>)}

            {flag && (<span className={styles.headerBlockFlag}>{flag}</span>)}
        </div>
    );
};

export default HeaderBlock;