import React from 'react';

function PageWrapper({ title, children }) {
    return (
        <div className="container mt-5 mb-5 p-4 rounded-4 shadow-lg bg-white bg-opacity-75">
            {title && (
                <>
                    <h2 className="mb-4 fw-bold text-c-primary text-center">{title}</h2>
                    <hr className="hr w-75 m-auto my-4" />
                </>
            )}
            {children}
        </div>
    );
}

export default PageWrapper;
