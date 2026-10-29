import bpy
import math

# Clear scene
bpy.ops.object.select_all(action='SELECT')
bpy.ops.object.delete(use_global=False)

for col in list(bpy.data.collections):
    bpy.data.collections.remove(col)
root_col = bpy.data.collections.new("CarthagoC2Tourer")
bpy.context.scene.collection.children.link(root_col)

scene = bpy.context.scene
scene.unit_settings.system = 'METRIC'
scene.unit_settings.scale_length = 1.0
scene.unit_settings.length_unit = 'METERS'

# Dimensions
LENGTH = 7.36
WIDTH = 2.17
BODY_THICKNESS = 0.12

# Colors
COLOR_BODY = (0.96, 0.96, 0.96, 1.0)
COLOR_STRIPE = (0.40, 0.40, 0.43, 1.0)
COLOR_MARKER = (0.90, 0.48, 0.35, 1.0)
COLOR_MARKER_DARK = (0.62, 0.33, 0.26, 1.0)
COLOR_GROUND = (0.94, 0.91, 0.84, 1.0)

materials = {}

def make_material(name, color, alpha=1.0, metallic=0.0, roughness=0.7):
    mat = bpy.data.materials.new(name=name)
    mat.use_nodes = True
    bsdf = mat.node_tree.nodes["Principled BSDF"]
    bsdf.inputs["Base Color"].default_value = color
    bsdf.inputs["Metallic"].default_value = metallic
    bsdf.inputs["Roughness"].default_value = roughness
    if alpha < 1.0:
        mat.blend_method = 'BLEND'
        bsdf.inputs["Alpha"].default_value = alpha
    materials[name] = mat
    return mat

make_material("body", COLOR_BODY, roughness=0.55)
make_material("stripe", COLOR_STRIPE, roughness=0.5)
make_material("marker", COLOR_MARKER, roughness=0.6)
make_material("marker_dark", COLOR_MARKER_DARK, roughness=0.6)
make_material("ground", COLOR_GROUND, roughness=1.0)

def create_box(name, x, y, z, w, d, h, mat_name):
    bpy.ops.mesh.primitive_cube_add(size=1, location=(x, y, z))
    obj = bpy.context.active_object
    obj.name = name
    obj.scale = (w, d, h)
    obj.data.materials.append(materials[mat_name])
    root_col.objects.link(obj)
    bpy.context.scene.collection.objects.unlink(obj)
    return obj

def create_plane(name, x, y, z, w, d, mat_name, rotation=(0, 0, 0)):
    bpy.ops.mesh.primitive_plane_add(size=1, location=(x, y, z), rotation=rotation)
    obj = bpy.context.active_object
    obj.name = name
    obj.scale = (w, d, 1)
    obj.data.materials.append(materials[mat_name])
    root_col.objects.link(obj)
    bpy.context.scene.collection.objects.unlink(obj)
    return obj

# Ground plane
create_plane("ground", 0, 0, -0.005, 22, 12, "ground")

# Main body slab
create_box("body_main", 0, 0, BODY_THICKNESS/2, LENGTH, WIDTH, BODY_THICKNESS, "body")

# Cab front hint
create_box("cab_front", LENGTH/2 + 0.10, 0, BODY_THICKNESS/2 * 0.9, 0.20, WIDTH - 0.28, BODY_THICKNESS * 0.85, "body")

# Thick outline frame on top
outline_z = BODY_THICKNESS + 0.005
frame_h = 0.015
frame_w = 0.04
create_box("outline_front", LENGTH/2 - 0.02, 0, outline_z, frame_w, WIDTH - 0.08, frame_h, "stripe")
create_box("outline_rear", -LENGTH/2 + 0.02, 0, outline_z, frame_w, WIDTH - 0.08, frame_h, "stripe")
create_box("outline_left", 0, WIDTH/2 - 0.02, outline_z, LENGTH - 0.08, frame_w, frame_h, "stripe")
create_box("outline_right", 0, -WIDTH/2 + 0.02, outline_z, LENGTH - 0.08, frame_w, frame_h, "stripe")

# Compartment hatches - raised boxes (like real hatches)
hatch_z = BODY_THICKNESS + 0.012
hatch_h = 0.024
hatches = [
    ("comp_heckgarage_links", -LENGTH/2 + 0.45, 0.42, 0.80, 0.70, "marker"),
    ("comp_heckgarage_rechts", -LENGTH/2 + 0.45, -0.42, 0.80, 0.70, "marker"),
    ("comp_seitenklappe_links_vorne", 2.3, WIDTH/2 - 0.30, 0.70, 0.40, "marker"),
    ("comp_seitenklappe_links_mitte", -0.2, WIDTH/2 - 0.30, 0.95, 0.40, "marker"),
    ("comp_seitenklappe_links_hinten", -2.6, WIDTH/2 - 0.30, 0.75, 0.40, "marker"),
    ("comp_seitenklappe_rechts_vorne", 2.3, -WIDTH/2 + 0.30, 0.70, 0.40, "marker"),
    ("comp_seitenklappe_rechts_mitte", -0.2, -WIDTH/2 + 0.30, 0.95, 0.40, "marker"),
    ("comp_seitenklappe_rechts_hinten", -2.6, -WIDTH/2 + 0.30, 0.75, 0.40, "marker"),
    ("comp_doppelboden_links_vorne", 1.4, WIDTH/2 - 0.30, 0.55, 0.35, "marker_dark"),
    ("comp_doppelboden_rechts_vorne", 1.4, -WIDTH/2 + 0.30, 0.55, 0.35, "marker_dark"),
    ("comp_doppelboden_links_hinten", -3.4, WIDTH/2 - 0.30, 0.55, 0.35, "marker_dark"),
    ("comp_doppelboden_rechts_hinten", -3.4, -WIDTH/2 + 0.30, 0.55, 0.35, "marker_dark"),
    ("comp_dachklappe", -1.2, 0.0, 0.60, 0.42, "marker"),
]

for name, x, y, w, d, mat in hatches:
    obj = create_box(name, x, y, hatch_z, w, d, hatch_h, mat)
    obj["is_compartment"] = True

# Lights with shadows
bpy.ops.object.light_add(type='SUN', location=(6, 5, 12))
sun = bpy.context.active_object
sun.data.energy = 3.0
sun.data.angle = math.radians(8)
sun.data.use_shadow = True
sun.rotation_euler = (math.radians(45), 0, math.radians(45))

bpy.ops.object.light_add(type='POINT', location=(0, 0, 8))
ambient = bpy.context.active_object
ambient.data.energy = 600
ambient.data.color = (1.0, 0.98, 0.95)

# Enable shadows in scene
scene.eevee.use_shadows = True

# Camera
cam_x = 1.0
cam_y = 8.0
cam_z = 11.0
bpy.ops.object.camera_add(location=(cam_x, cam_y, cam_z))
cam = bpy.context.active_object
cam.rotation_euler = (
    math.radians(30),
    0,
    math.radians(173),
)
scene.camera = cam

# Export
output_path = "/Users/danielfaludi/carthago-c2-tourer-inventory/web/public/models/c2-tourer.glb"
bpy.ops.export_scene.gltf(
    filepath=output_path,
    export_format='GLB',
    export_yup=True,
    export_apply=True,
    export_materials='EXPORT'
)

print(f"Exported model to {output_path}")
