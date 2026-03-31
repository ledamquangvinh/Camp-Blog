const BASE_URL = "http://localhost:3000";

// LOGIN
export async function login(username: string, password: string) {
    const res = await fetch(`${BASE_URL}/auth/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
    });

    return res.json();
}

// GET MY TRIPS
export async function getMyTrips(token: string) {
    const res = await fetch(`${BASE_URL}/trips/me`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    return res.json();
}
