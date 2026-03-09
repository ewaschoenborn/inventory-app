const IconContainer = (props: {
    icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
    width?: string;
    height?: string;
    color?: string;
    onClick?: (e: React.MouseEvent<HTMLDivElement>) => void;
}) => {
    if (!props.icon) return null;

    return (
        <div
            style={{
                width: props.width ?? '1.2em',
                height: props.height ?? '1.2em',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: props.onClick ? 'pointer' : 'default',
            }}
            onClick={props.onClick}
        >
            <props.icon width="100%" height="100%" color={props.color} />
        </div>
    );
};

export default IconContainer;
