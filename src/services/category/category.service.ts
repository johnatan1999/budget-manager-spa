import BasicService from "../basic.service";
import Config from "../../config/api.config.json";

export default class CategoryService extends BasicService {

    static getAll = () => {
        return BasicService.fetchData(Config.Category.FindAll)
        .then((res) => res.data);
    }

    static import = (data) => {
        return BasicService.postData(Config.Category.Import, data)
        .then((res) => res.data)
        .catch((err) => { throw err });
    }

    static saveCategory = (category) => {
        return BasicService.postData(Config.Category.Add, category)
        .then((res) => res.data)
        .catch(err => { throw err });
    }

    static deleteCategory = (categoryId) => {
        return BasicService.deleteData(`${Config.Category.Delete}${categoryId}`, categoryId)
        .then((res) => res.data)
    }

}