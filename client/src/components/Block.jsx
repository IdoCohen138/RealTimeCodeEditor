
export default function Block ({changeCode, codeContent, isMentor}) {

    return(

        <div>
            <div className="window-title">
                {isMentor ? "Mentor" : "Student"}
            </div>
            {isMentor ? (
                <pre>
                    <code className="language-javascript">{codeContent}</code>
                </pre>
            ) : (
                <textarea 
                    className="textarea-editor"
                    value={codeContent}
                    onChange={changeCode}
                    placeholder="Enter your code here..."
                />
            )}
        </div>

    );
}
