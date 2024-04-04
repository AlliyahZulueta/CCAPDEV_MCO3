function redirectToPage(laundryShopName) {
    let pageName;

    switch (laundryShopName) {
        case 'Weclean':
            pageName = '/Weclean';
            break;
        case 'Nonstop Laundry Shop Malate':
            pageName = '/NonstopLaundryShopMalate';
            break;
        case '7Folds Laundry':
            pageName = '/7FoldsLaundry';
            break;
        case 'XYZ Laundry Service':
            pageName = '/XYZLaundryService';
            break;
        default:
            pageName = 'default.html'; // You can set a default page or handle it as needed.
            break;
    }

    window.location.href = pageName;
}
