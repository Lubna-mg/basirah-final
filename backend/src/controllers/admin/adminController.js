// src/controllers/adminController.js
import Center from "../../models/Center.js";
import { logAdminActivity } from "../../utils/adminActivityLogger.js";

// POST /api/admin/centers
export const createCenter = async (req, res) => {
  try {
    const {
      name,
      city,
      address,
      contactEmail,
      contactPhone,
      subscriptionPlan,
      notes,
    } = req.body;

    if (!name) {
      return res.status(400).json({ message: "اسم المركز مطلوب" });
    }

    const center = await Center.create({
      name,
      city,
      address,
      contactEmail,
      contactPhone,
      subscriptionPlan: subscriptionPlan || "تجريبي",
      status: "pending",
      isActive: true,
      notes,
    });

    await logAdminActivity({
      adminId: req.adminId,
      action: `إضافة مركز جديد (${center.name})`,
      meta: { centerId: center._id },
    });

    res.status(201).json(center);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/admin/centers
export const getCenters = async (req, res) => {
  try {
    const centers = await Center.find().sort({ createdAt: -1 });
    res.json(centers);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/admin/centers/:id
export const getCenterById = async (req, res) => {
  try {
    const center = await Center.findById(req.params.id);
    if (!center) {
      return res.status(404).json({ message: "المركز غير موجود" });
    }
    res.json(center);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// PUT /api/admin/centers/:id
export const updateCenter = async (req, res) => {
  try {
    const {
      name,
      city,
      address,
      contactEmail,
      contactPhone,
      subscriptionPlan,
      status,
      isActive,
      notes,
    } = req.body;

    const center = await Center.findById(req.params.id);
    if (!center) {
      return res.status(404).json({ message: "المركز غير موجود" });
    }

    const before = center.toObject();

    if (name !== undefined) center.name = name;
    if (city !== undefined) center.city = city;
    if (address !== undefined) center.address = address;
    if (contactEmail !== undefined) center.contactEmail = contactEmail;
    if (contactPhone !== undefined) center.contactPhone = contactPhone;
    if (subscriptionPlan !== undefined)
      center.subscriptionPlan = subscriptionPlan;
    if (status !== undefined) center.status = status;
    if (typeof isActive === "boolean") center.isActive = isActive;
    if (notes !== undefined) center.notes = notes;

    await center.save();

    await logAdminActivity({
      adminId: req.adminId,
      action: `تعديل بيانات مركز (${center.name})`,
      meta: {
        centerId: center._id,
        before,
        after: center.toObject(),
      },
    });

    res.json(center);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// DELETE /api/admin/centers/:id
export const deleteCenter = async (req, res) => {
  try {
    const center = await Center.findById(req.params.id);
    if (!center) {
      return res.status(404).json({ message: "المركز غير موجود" });
    }

    await center.deleteOne();

    await logAdminActivity({
      adminId: req.adminId,
      action: `حذف مركز (${center.name})`,
      meta: { centerId: center._id },
    });

    res.json({ message: "تم حذف المركز" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
