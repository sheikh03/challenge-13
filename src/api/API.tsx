const API_BASE_URL = 'https://api.github.com';

const searchGithub = async () => {
  try {
    const startPoint = Math.floor(Math.random() * 50000000) + 1000;

    const response = await fetch(
      `${API_BASE_URL}/users?since=${startPoint}`,
      {
        headers: {
          Authorization: `Bearer ${import.meta.env.VITE_GITHUB_TOKEN}`,
          'Accept': 'application/vnd.github.v3+json',
        },
      }
    );

    if (!response.ok) {
      console.error('GitHub API responded with:', response.status);
      throw new Error('Failed to fetch users');
    }

    const userData = await response.json();
    return userData;
  } catch (error) {
    console.error('Error fetching GitHub users:', error);
    return [];
  }
};

const searchGithubUser = async (username: string) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/users/${username}`,
      {
        headers: {
          Authorization: `Bearer ${import.meta.env.VITE_GITHUB_TOKEN}`,
          'Accept': 'application/vnd.github.v3+json',
        },
      }
    );

    if (!response.ok) {
      console.error(`Failed to fetch user ${username}:`, response.status);
      throw new Error('User fetch failed');
    }

    const userDetails = await response.json();
    return userDetails;
  } catch (error) {
    console.error(`Error fetching user ${username}:`, error);
    return null;
  }
};

export { searchGithub, searchGithubUser };