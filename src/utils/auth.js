
export const isAuthenticated = () => {
    const token = sessionStorage.getItem('token');
    if (!token) return false;
  
    // Zkontrolujte platnost tokenu (např. pomocí JWT decode)
    // Zde předpokládáme, že token je platný, pokud existuje
    return true;
  };