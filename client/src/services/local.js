import countriesData from '../data/countries.json';

const STORAGE_KEY = 'travel_tracker_data';

// Helper to get raw data
const getStorageData = () => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) return JSON.parse(stored);
    return {
        users: [
            { id: 1, name: 'Family', color: 'teal' } // Default user
        ],
        visited_countries: [], // { country_code, user_id }
        currentUserId: 1
    };
};

// Helper to save data
const saveStorageData = (data) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
};

const localAPI = {
    getData: async () => {
        const data = getStorageData();
        const currentUserId = data.currentUserId;

        // Calculate derived data similar to backend
        const userCountries = data.visited_countries
            .filter(v => v.user_id === currentUserId)
            .map(v => v.country_code);

        // Grouped by country code for map (all visits)
        // Backend returns count of visits per country code
        const allVisits = [];
        const visitCounts = {};
        data.visited_countries.forEach(v => {
            visitCounts[v.country_code] = (visitCounts[v.country_code] || 0) + 1;
        });
        // Format expected: [{country_code: 'FR', visit_count: '2'}]
        Object.keys(visitCounts).forEach(code => {
            allVisits.push({ country_code: code, visit_count: visitCounts[code] });
        });

        const currentUser = data.users.find(u => u.id === currentUserId);
        const color = currentUser ? currentUser.color : 'teal';

        return {
            countries: userCountries,
            allVisits: allVisits,
            allUserVisits: data.visited_countries,
            totalWorldCountries: countriesData.length,
            total: userCountries.length,
            users: data.users,
            color: color,
            currentUserId: currentUserId
        };
    },

    addCountry: async (countryName) => {
        const data = getStorageData();
        const lowerName = countryName.toLowerCase();

        // Find country
        const country = countriesData.find(c => c.name.toLowerCase().includes(lowerName));

        if (!country) {
            throw { response: { data: { error: "Country not found" } } };
        }

        // Check if already visited by current user
        const exists = data.visited_countries.some(
            v => v.country_code === country.code && v.user_id === data.currentUserId
        );

        if (exists) {
            throw { response: { data: { error: "Country already added" } } };
        }

        // Add visit
        data.visited_countries.push({
            country_code: country.code,
            user_id: data.currentUserId
        });

        saveStorageData(data);
        return { success: true, message: "Country added successfully" };
    },

    addUser: async (name, color) => {
        const data = getStorageData();
        const newId = data.users.length > 0 ? Math.max(...data.users.map(u => u.id)) + 1 : 1;

        const newUser = { id: newId, name, color };
        data.users.push(newUser);
        data.currentUserId = newId; // Auto-switch to new user

        saveStorageData(data);

        return {
            success: true,
            userId: newId,
            message: "User created successfully"
        };
    },

    switchUser: async (userId) => {
        const data = getStorageData();
        data.currentUserId = userId;
        saveStorageData(data);
        return { success: true, currentUserId: userId };
    },

    deleteCountry: async (countryName) => {
        const data = getStorageData();
        const lowerName = countryName.toLowerCase();

        // Find country code by name
        const country = countriesData.find(c => c.name.toLowerCase().includes(lowerName));

        if (!country) {
            throw { response: { data: { error: "Country not found" } } };
        }
        const countryCode = country.code;

        const initialLength = data.visited_countries.length;
        data.visited_countries = data.visited_countries.filter(
            v => !(v.user_id === data.currentUserId && v.country_code === countryCode)
        );

        if (data.visited_countries.length === initialLength) {
            throw { response: { data: { error: "Country not visited" } } };
        }

        saveStorageData(data);
        return { success: true, message: "Country deleted successfully" };
    },

    deleteUser: async (userId) => {
        const data = getStorageData();

        // Check if user exists
        const userIndex = data.users.findIndex(u => u.id === userId);
        if (userIndex === -1) {
            throw { response: { data: { error: "User not found" } } };
        }

        // Remove user
        data.users.splice(userIndex, 1);

        // Remove visits for this user
        data.visited_countries = data.visited_countries.filter(v => v.user_id !== userId);

        // Reset currentUserId if we deleted the active user
        if (data.currentUserId === userId) {
            if (data.users.length > 0) {
                data.currentUserId = data.users[0].id;
            } else {
                data.currentUserId = null;
            }
        }

        saveStorageData(data);
        return { success: true, message: "User deleted successfully", currentUserId: data.currentUserId };
    }
};

export default localAPI;
