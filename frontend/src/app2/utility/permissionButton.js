

// utils/permissionButton.js

export const canAction = () => {
    const pathname = window.location.pathname;

    const user = (JSON.parse(localStorage.getItem("user"))).user;
    // console.log("pathname", pathname)
    // console.log("user", user)
    if (!user) return false;

    if (user.role[0] === "superadmin") return true;

    if (user.role[0] === "user") return false;

    if (user.role[0] === "admin") {
        return user.Permissionroute.some(route =>
            pathname.startsWith(route)
        );
    }

    return false;
};


// utils/permissionButton.js

// export const canAction = (pathname) => {
//     const user = JSON.parse(localStorage.getItem("user"));

//     if (!user) return false;

//     if (user.role === "superadmin") return true;

//     if (user.role === "user") return false;

//     if (user.role === "admin") {
//         return user.Permissionroute.some(route =>
//             pathname.startsWith(route)
//         );
//     }

//     return false;
// };