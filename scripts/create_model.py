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

# Dimensions (Carthago C2-tourer I 148 RB-QB L comfort)
LENGTH = 7.36
WIDTH = 2.17
WHEELBASE = 4.035
ROOF_HEIGHT = 2.95
CHASSIS_HEIGHT = 0.55
FLOOR_HEIGHT = 0.85
WALL_THICKNESS = 0.06

# Colors
COLOR_BODY = (0.97, 0.97, 0.97, 1.0)
COLOR_LOWER = (0.78, 0.78, 0.80, 1.0)
COLOR_STRIPE = (0.38, 0.38, 0.41, 1.0)
COLOR_WINDOW = (0.42, 0.58, 0.74, 0.7)
COLOR_TIRE = (0.10, 0.10, 0.10, 1.0)
COLOR_RIM = (0.80, 0.80, 0.83, 1.0)
COLOR_HATCH = (0.90, 0.48, 0.35, 1.0)
COLOR_HATCH_DARK = (0.62, 0.33, 0.26, 1.0)
COLOR_GROUND = (0.92, 0.89, 0.82, 1.0)

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

make_material("body", COLOR_BODY, roughness=0.45)
make_material("lower", COLOR_LOWER, roughness=0.55)
make_material("stripe", COLOR_STRIPE, roughness=0.5)
make_material("window", COLOR_WINDOW, alpha=0.7, roughness=0.15)
make_material("tire", COLOR_TIRE, roughness=0.95)
make_material("rim", COLOR_RIM, metallic=0.6, roughness=0.25)
make_material("hatch", COLOR_HATCH, roughness=0.5)
make_material("hatch_dark", COLOR_HATCH_DARK, roughness=0.5)
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

# Ground
create_plane("ground", 0, 0, -0.005, 24, 12, "ground")

# Main living box (white upper body)
body_length = LENGTH - 0.45
body_z = CHASSIS_HEIGHT + (FLOOR_HEIGHT - CHASSIS_HEIGHT) / 2
body_h = FLOOR_HEIGHT - CHASSIS_HEIGHT
create_box("body_main", -0.15, 0, body_z, body_length, WIDTH, body_h, "body")

# Lower chassis skirt (grey, narrower)
create_box("chassis", 0, 0, CHASSIS_HEIGHT/2, LENGTH, WIDTH - 0.10, CHASSIS_HEIGHT, "lower")

# Roof (slightly wider, flat)
create_box("roof", -0.15, 0, FLOOR_HEIGHT + 0.02, body_length + 0.08, WIDTH + 0.04, 0.04, "body")

# Cab front (tapered front)
cab_x = LENGTH/2 - 0.10
cab_len = 0.45
cab_width = WIDTH - 0.28
cab_z = CHASSIS_HEIGHT + 0.18
cab_h = FLOOR_HEIGHT - CHASSIS_HEIGHT - 0.10
create_box("cab", cab_x, 0, cab_z, cab_len, cab_width, cab_h, "body")

# Windshield
create_box("windshield", cab_x + cab_len/2 + 0.01, 0, cab_z + 0.10, 0.02, cab_width - 0.12, 0.42, "window")

# Side windows
create_box("window_left_front", 1.15, WIDTH/2 + 0.005, cab_z + 0.08, 1.3, 0.02, 0.42, "window")
create_box("window_left_rear", -1.9, WIDTH/2 + 0.005, cab_z + 0.06, 2.6, 0.02, 0.40, "window")
create_box("window_right_front", 1.15, -WIDTH/2 - 0.005, cab_z + 0.08, 1.3, 0.02, 0.42, "window")
create_box("window_right_rear", -1.9, -WIDTH/2 - 0.005, cab_z + 0.06, 2.6, 0.02, 0.40, "window")

# Decorative side stripe
create_box("stripe_left", -0.15, WIDTH/2 + 0.006, CHASSIS_HEIGHT + 0.22, body_length - 0.10, 0.015, 0.08, "stripe")
create_box("stripe_right", -0.15, -WIDTH/2 - 0.006, CHASSIS_HEIGHT + 0.22, body_length - 0.10, 0.015, 0.08, "stripe")

# Wheels - placed under chassis, not intersecting body
wheel_z = 0.34
wheel_y_out = WIDTH/2 + 0.14
def create_wheel(x, y):
    bpy.ops.mesh.primitive_cylinder_add(radius=0.34, depth=0.18, location=(x, y, wheel_z))
    wheel = bpy.context.active_object
    wheel.name = f"wheel_{x}_{y}"
    wheel.rotation_euler = (0, math.radians(90), 0)
    wheel.data.materials.append(materials["tire"])
    root_col.objects.link(wheel)
    bpy.context.scene.collection.objects.unlink(wheel)
    bpy.ops.mesh.primitive_cylinder_add(radius=0.17, depth=0.20, location=(x, y, wheel_z))
    rim = bpy.context.active_object
    rim.name = f"rim_{x}_{y}"
    rim.rotation_euler = (0, math.radians(90), 0)
    rim.data.materials.append(materials["rim"])
    root_col.objects.link(rim)
    bpy.context.scene.collection.objects.unlink(rim)

create_wheel(WHEELBASE/2, wheel_y_out)
create_wheel(WHEELBASE/2, -wheel_y_out)
create_wheel(-WHEELBASE/2, wheel_y_out)
create_wheel(-WHEELBASE/2, -wheel_y_out)

# Hatches - raised boxes on side and rear, NO overlap with body holes, just placed on surface
hatch_h = 0.035
hatch_z_left = WIDTH/2 + 0.008
hatch_z_right = -WIDTH/2 - 0.008
rear_x = -LENGTH/2 + 0.02
rear_z = CHASSIS_HEIGHT + 0.35

hatches = [
    # Rear garage doors
    ("comp_heckgarage_links", rear_x, 0.42, rear_z, 0.02, 0.72, 0.68, "hatch"),
    ("comp_heckgarage_rechts", rear_x, -0.42, rear_z, 0.02, 0.72, 0.68, "hatch"),
    
    # Left side hatches (3)
    ("comp_seitenklappe_links_vorne", 2.2, hatch_z_left, CHASSIS_HEIGHT + 0.25, 0.72, 0.02, 0.42, "hatch"),
    ("comp_seitenklappe_links_mitte", -0.2, hatch_z_left, CHASSIS_HEIGHT + 0.25, 1.0, 0.02, 0.42, "hatch"),
    ("comp_seitenklappe_links_hinten", -2.6, hatch_z_left, CHASSIS_HEIGHT + 0.25, 0.78, 0.02, 0.42, "hatch"),
    
    # Right side hatches (3)
    ("comp_seitenklappe_rechts_vorne", 2.2, hatch_z_right, CHASSIS_HEIGHT + 0.25, 0.72, 0.02, 0.42, "hatch"),
    ("comp_seitenklappe_rechts_mitte", -0.2, hatch_z_right, CHASSIS_HEIGHT + 0.25, 1.0, 0.02, 0.42, "hatch"),
    ("comp_seitenklappe_rechts_hinten", -2.6, hatch_z_right, CHASSIS_HEIGHT + 0.25, 0.78, 0.02, 0.42, "hatch"),
    
    # Double floor hatches (darker, smaller)
    ("comp_doppelboden_links_vorne", 1.4, hatch_z_left, CHASSIS_HEIGHT + 0.10, 0.55, 0.02, 0.35, "hatch_dark"),
    ("comp_doppelboden_rechts_vorne", 1.4, hatch_z_right, CHASSIS_HEIGHT + 0.10, 0.55, 0.02, 0.35, "hatch_dark"),
    ("comp_doppelboden_links_hinten", -3.4, hatch_z_left, CHASSIS_HEIGHT + 0.10, 0.55, 0.02, 0.35, "hatch_dark"),
    ("comp_doppelboden_rechts_hinten", -3.4, hatch_z_right, CHASSIS_HEIGHT + 0.10, 0.55, 0.02, 0.35, "hatch_dark"),
    
    # Roof hatch
    ("comp_dachklappe", -1.2, 0.0, FLOOR_HEIGHT + 0.045, 0.62, 0.45, 0.02, "hatch"),
]

for name, x, y, z, w, d, h, mat in hatches:
    obj = create_box(name, x, y, z, w, d, h, mat)
    obj["is_compartment"] = True

# Hatch frames (thin dark borders around hatches)
frame_thick = 0.02
for name, x, y, z, w, d, h, mat in hatches:
    frame_name = name + "_frame"
    if abs(d) < 0.03:  # side hatch
        create_box(frame_name, x, y + (0.004 if y > 0 else -0.004), z, w + 0.04, frame_thick, h + 0.04, "stripe")
    elif abs(w) < 0.03:  # rear hatch
        create_box(frame_name, x + (0.004 if x < 0 else -0.004), y, z, frame_thick, d + 0.04, h + 0.04, "stripe")
    else:  # roof hatch
        create_box(frame_name, x, y, z + 0.004, w + 0.04, d + 0.04, 0.012, "stripe")

# Lights
bpy.ops.object.light_add(type='SUN', location=(6, 5, 12))
sun = bpy.context.active_object
sun.data.energy = 3.0
sun.data.angle = math.radians(8)
sun.data.use_shadow = True
sun.rotation_euler = (math.radians(45), 0, math.radians(45))

bpy.ops.object.light_add(type='POINT', location=(0, 0, 8))
ambient = bpy.context.active_object
ambient.data.energy = 500
ambient.data.color = (1.0, 0.98, 0.95)

# Camera - top down
cam_x = 1.0
cam_y = 7.5
cam_z = 11.0
bpy.ops.object.camera_add(location=(cam_x, cam_y, cam_z))
cam = bpy.context.active_object
cam.rotation_euler = (
    math.radians(32),
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
