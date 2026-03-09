const IconContainer = (props: {
    icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
    width?: string;
    height?: string;
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
            }}
        >
            <props.icon width="100%" height="100%" />
        </div>
    );
};

export default IconContainer;
