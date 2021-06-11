import React from 'react';

type Props = {
    path: string;
    className?: string;
    style?: React.CSSProperties;
};

/* @TODO needs editorUrl in ignition: 
    https://github.com/facade/ignition/blob/508d80f91de953617977e5666f8953669b6e81f2/resources/js/components/Shared/FilePath.vue */

export default function FilePath({ path, className = '', ...props }: Props) {
    const segments = path.replace(/^\/Users/, '~').split('/');
    const file = segments.pop() || '';
    const fileSegments = file.split('.');

    return (
        <span className={`ui-path ${className}`} {...props}>
            {segments.map((segment, i) => (
                <span key={i}>
                    {segment}/<wbr />
                </span>
            ))}
            {fileSegments.map((fileSegment, i) => (
                <span key={i} className={i === 0 ? 'font-semibold' : ''}>
                    {i > 0 && '.'}
                    {fileSegment}
                </span>
            ))}
        </span>
    );
}
