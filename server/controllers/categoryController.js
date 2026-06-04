const Category = require("../models/categoryModel")

const getCategories = async(req , res) =>{
    try{
        const categories  = await Category.find().sort({name:1})

        res.json(categories)
    }catch(error){
        console.error("GET CATEGORIES ERROR:", error);

        res.status(500).json({
            message:"Failed to fetch categories"
        })
    }
}

const createCategory  = async (req , res)=>{
    try{
        const{ name} = req.body;

        if( !name?.trim()){
            return res.status(400).json({
                message: "Category name is required",
            })
        }

        const existingCategory  = await Category.findOne({
            name: name.trim()
        })

        if(existingCategory){
            return res.status(400).json({
                message: "Category already exists",
            })
        }

        const category = await  Category.create({
            name: name.trim()
        })
        res.status(201).json(category)
    }
    catch(error){
        console.error("CREATE CATEGORY ERROR:", error);
        res.status(500).json({
            message: "Failed to create category",
        })
    }
}

const deleteCategory  = async(req, res)=>{
    try{
        const categoty = await Category.findById(req.params.id)

        if(!categoty){
            return res.status(404).json({
                 message: "Category not found",
            })
        }

        await categoty.deleteOne()

        res.json({
             message: "Category deleted",
        })
    }catch(error){
        console.error("DELETE CATEGORY ERROR:", error);

        res.status(500).json({
             message: "Failed to delete category",
        })
    }
}

module.exports= {
    getCategories,
  createCategory,
  deleteCategory,
}