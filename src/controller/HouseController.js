import House from "../models/House";
import Society from "../models/Society";
import tryCatch from "../utils/tryCatch";

// Get All House or by Id
export const getHouse = tryCatch(async (req, res) => {
  const house = req.params.id
    ? await House.findById(req.params.id)
    : await House.find();
  res.status(200).json({ data: house });
});

// Add new house
export const addHouse = tryCatch(async (req, res, next) => {
  const {
    society,
    house_number,
    wing,
    maintenance,
    is_flat,
    flat_type,
    is_half_tenant,
    is_full_tenant,
    tenant_amount,
    is_sell,
    sell_amount,
  } = req.body;

  const societyExist = await Society.findById(society);
  if (!societyExist) {
    return next({
      message: "Society doesn't exist",
    });
  }

  let buildingOrSociety = societyExist.is_building ? "building" : "society";
  let houseOrFlat = is_flat ? "Flat" : "House";

  const houseExist = await House.findOne({ society, house_number, wing });
  if (houseExist) {
    return next({
      message: `${houseOrFlat} already exist`,
    });
  }

  await House.create({
    society,
    house_number,
    wing,
    maintenance,
    is_flat,
    flat_type,
    is_half_tenant,
    is_full_tenant,
    tenant_amount,
    is_sell,
    sell_amount,
  });

  return res.status(201).json({
    success: true,
    message: `${wing}/${house_number} ${houseOrFlat} added successfully for ${societyExist.name} ${buildingOrSociety}`,
  });
});

// Update existing house
export const updateHouse = tryCatch(async (req, res, next) => {
  const { society, wing, house_number, is_flat } = req.body;
  let houseOrFlat = is_flat ? "Flat" : "House";

  const societyExist = await Society.findById(society);
  if (!societyExist) {
    return next({
      message: "Society doesn't exist",
    });
  }

  let houseExist = await House.findById(req.params.id);
  if (!houseExist) {
    return next({
      message: `${houseOrFlat} doesn't exist`,
    });
  }

  houseExist = await House.findOne({
    society,
    wing,
    house_number,
    is_flat,
  }).populate("society", "name");
  if (houseExist && houseExist.id !== req.params.id) {
    return next({
      message: `${wing}/${house_number} ${houseOrFlat} in ${houseExist.society.name} society/building already exists`,
    });
  }

  const house = await House.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  house.save();

  return res.status(200).json({
    success: true,
    message: `${wing}/${house_number} ${houseOrFlat} updated successfully`,
  });
});

// Delete house by Id
export const deleteHouse = tryCatch(async (req, res, next) => {
  const house = await House.findById(req.params.id);
  if (!house) {
    return next({
      message: "This house or flat is not exist in the records",
    });
  }
  let houseOrFlat = house.is_flat ? "Flat" : "House";

  await House.deleteOne({ _id: house._id });

  return res.status(200).json({
    success: true,
    message: `${houseOrFlat} deleted successfully`,
  });
});

// Delete all house
export const deleteAllHouse = tryCatch(async (req, res, next) => {
  await House.deleteMany();

  return res.status(200).json({
    success: true,
    message: "All house deleted successfully",
  });
});
