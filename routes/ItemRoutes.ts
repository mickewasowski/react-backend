import express from 'express';
import { getAllItems, updateItem, postItem, deleteItem, getAllItemsCount, getAllItemsCountPerOwner, getLatestThreeAdded, getItemsPerOwner, getRecipeById } from '../controllers/ItemController';

const router = express.Router();

router.route("/").get(getAllItems).post(postItem).patch(updateItem).delete(deleteItem);
router.route("/count").get(getAllItemsCount);
router.route("/ownedCount").get(getAllItemsCountPerOwner);
router.route("/owned").get(getItemsPerOwner);
router.route("/latest").get(getLatestThreeAdded);
router.route("/get").get(getRecipeById);
//DEPRECATED
// router.route("/search").get(searchItem);

export default router;