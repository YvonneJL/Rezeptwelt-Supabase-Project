//interfaces fetch für Fav Liste

export interface IIngredient {
    id: number,
    recipe_id: number,
    name: string,
    quantity: number,
    unit: string,
    additonal_info: string,
    recipes: IRecipe 
}

export interface IRecipe {
    id: number,
    name: string,
    description: string,
    servings: number,
    instructions: string,
    category_id: number,
    categories: ICategory
    url: string
}

export interface ICategory {
    id: number,
    name: string
}


export interface IUser {
    user_metadata: any;
    id?: string | undefined,
    username: string,
    firstname: string,
    lastname: string,
    email: string,
    password: string
}
