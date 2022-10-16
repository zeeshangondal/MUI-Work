export let items = [
    {
        id:1,
        name:"pen",
        categoryId:1,
        packagingId:1,
        quantity:10,
    },
    {
        id:2,
        name:"pencils",
        categoryId:1,
        packagingId:1,
        quantity:1,
    },
    {
        id:3,
        name:"plates",
        categoryId:1,
        packagingId:1,
        quantity:40,
    },
    {
        id:4,
        name:"glass",
        categoryId:0,
        packagingId:1,
        quantity:244,
    },
    {
        id:5,
        name:"chairs",
        categoryId:1,
        packagingId:0,
        quantity:30,
    }
]

export const categoryOptions = [
    {id: 0, title: 'Utensils'},
    {id: 1, title: 'Stationary'}
];

export const packagingOptions = [
    {id:0, title:'box'},
    {id:1, title:'single'},
]

export function addItem(item){
    console.log("added")
    item.id=items.length+1;
    items.push(item);
    console.log(items);
}

export function updateItem(item) {
    console.log("updated")
    let itemIndex = items.findIndex(x => x.id===item.id);
    items[itemIndex] = {...item};
}

export function deleteItem(item){
    items = items.filter(i => i.id!==item);
}

export function getItems(){
    let category = categoryOptions;
    let packaging = packagingOptions;
    return items.map(x => ({
        ...x,
        category: category[x.categoryId ].title,
        packaging: packaging[x.packagingId].title,
    }))
}