import React from "react"



export default function LoginView() {
    return (
        <form>
            <label>
                Username:
                <input type="text" />
            </label>
            <label>
                Password:
                <input type="password" />
            </label>
            <button type="submit">Submit</button>
        </form>
    )
}