import bpy
import os
import math

# Clear default scene
bpy.ops.object.select_all(action='SELECT')
bpy.ops.object.delete(use_global=False)

# Remove default collections and create our own
for col in list(bpy.data.collections):
    bpy.data.collections.remove(col)
root_col = bpy.data.collections.new("CarthagoC2Tourer")
bpy.context.scene.collection.children.link(root_col)

# Set units
scene = bpy.context.scene
scene.unit_settings.system = 'METRIC'
scene.unit_settings.scale_length = 1.0
scene.unit_settings.length_unit = 'METERS'

# Vehicle dimensions (meters)
LENGTH = 7.36
WIDTH = 2.17
HEIGHT = 2.95
WALL_THICKNESS = 0.05
FLOOR_THICKNESS = 0.22  # double floor height

# Colors
COLOR_BODY = (0.95, 0.95, 0.95, 1.0)
COLOR_WINDOW = (0.6, 0.8, 0.95, 0.4)
COLOR_FLOOR = (0.75, 0.7, 0.65, 1.0)
COLOR_WOOD = (0.72, 0.55, 0.38, 1.0)
COLOR_COMPARTMENT = (0.88, 0.66, 0.52, 0.35)  # terracotta transparent
COLOR_COMPARTMENT_SELECTED = (0.88, 0.48, 0.37, 0.65)
COLOR_BED = (0.85, 0.82, 0.78, 1.0)
COLOR_SEAT = (0.55, 0.55, 0.55, 1.0)

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

make_material("body", COLOR_BODY)
make_material("window", COLOR_WINDOW, alpha=0.4, roughness=0.1)
make_material("floor", COLOR_FLOOR, roughness=0.9)
make_material("wood", COLOR_WOOD)
make_material("compartment", COLOR_COMPARTMENT, alpha=0.35)
make_material("compartment_selected", COLOR_COMPARTMENT_SELECTED, alpha=0.65)
make_material("bed", COLOR_BED)
make_material("seat", COLOR_SEAT)

def create_box(name, x, y, z, w, d, h, mat_name, parent=None):
    """Create a box centered at x,y,z with dimensions w,d,h."""
    bpy.ops.mesh.primitive_cube_add(size=1, location=(x, y, z))
    obj = bpy.context.active_object
    obj.name = name
    obj.scale = (w, d, h)
    obj.data.materials.append(materials[mat_name])
    root_col.objects.link(obj)
    bpy.context.scene.collection.objects.unlink(obj)
    if parent:
        obj.parent = parent
    return obj

# Exterior shell (simplified as a solid block with window cutouts? No, just a block for silhouette)
shell = create_box("shell", 0, 0, HEIGHT/2 - 0.1, LENGTH, WIDTH, HEIGHT - 0.2, "body")

# Windows (flat planes on sides)
# Side windows - left
win_left = create_box("window_left", 0, WIDTH/2 + 0.01, 1.8, 5.5, 0.02, 0.8, "window")
win_right = create_box("window_right", 0, -WIDTH/2 - 0.01, 1.8, 5.5, 0.02, 0.8, "window")
# Front windshield
win_front = create_box("window_front", LENGTH/2 + 0.01, 0, 1.6, 0.02, 1.8, 0.9, "window")

# Interior floor (slightly above bottom)
floor = create_box("interior_floor", 0, 0, FLOOR_THICKNESS/2, LENGTH - 0.3, WIDTH - 0.2, FLOOR_THICKNESS, "floor")

# Interior ceiling
create_box("interior_ceiling", 0, 0, HEIGHT - 0.15, LENGTH - 0.3, WIDTH - 0.2, 0.1, "wood")

# Walls
# Left wall
create_box("wall_left", 0, WIDTH/2 - 0.05, HEIGHT/2 + 0.1, LENGTH - 0.3, 0.1, HEIGHT - 0.4, "wood")
# Right wall
create_box("wall_right", 0, -WIDTH/2 + 0.05, HEIGHT/2 + 0.1, LENGTH - 0.3, 0.1, HEIGHT - 0.4, "wood")
# Rear wall
create_box("wall_rear", -LENGTH/2 + 0.05, 0, HEIGHT/2 + 0.1, 0.1, WIDTH - 0.2, HEIGHT - 0.4, "wood")
# Partition: bathroom/bedroom divider
create_box("partition_bath", -1.5, 0, HEIGHT/2 + 0.1, 0.1, WIDTH - 0.2, HEIGHT - 0.4, "wood")
# Partition: front cabin / living
create_box("partition_cab", 2.2, 0, HEIGHT/2 + 0.1, 0.1, WIDTH - 0.2, HEIGHT - 0.4, "wood")

# Kitchen block (right side, middle)
create_box("kitchen_block", 0.3, -WIDTH/2 + 0.55, 1.0, 2.2, 0.9, 1.5, "wood")
# Fridge
create_box("fridge", 0.8, -WIDTH/2 + 0.45, 1.2, 0.7, 0.7, 1.7, "body")

# L-lounge (left side, front area)
# Main bench along left wall
create_box("lounge_bench", 1.5, WIDTH/2 - 0.45, 0.6, 2.0, 0.7, 0.8, "seat")
# Side bench
create_box("lounge_side_bench", 2.2, 0.3, 0.5, 0.7, 1.0, 0.7, "seat")
# Table
create_box("table", 1.4, 0.0, 0.7, 0.8, 0.6, 0.05, "wood")

# Bathroom (left side, between lounge and bed)
create_box("bathroom_block", -0.6, WIDTH/2 - 0.55, 1.0, 1.4, 0.9, 1.7, "wood")

# Bed area (rear)
# Queens bed
create_box("bed", -2.6, 0.0, 0.75, 1.9, 1.45, 0.45, "bed")
# Wardrobes on sides
create_box("wardrobe_left", -2.6, WIDTH/2 - 0.35, 1.3, 1.9, 0.4, 1.8, "wood")
create_box("wardrobe_right", -2.6, -WIDTH/2 + 0.35, 1.3, 1.9, 0.4, 1.8, "wood")

# Overhead cabinets
create_box("overhead_left", 1.5, WIDTH/2 - 0.35, 1.9, 2.0, 0.35, 0.5, "wood")
create_box("overhead_bed", -2.6, 0.0, 1.9, 1.9, 1.2, 0.45, "wood")

# Compartments (interactive parts) - these are the clickable storage volumes
compartments = [
    # (name, x, y, z, w, d, h)
    ("comp_garage_left", -3.2, 0.5, 0.7, 1.8, 0.9, 1.1),
    ("comp_garage_right", -3.2, -0.5, 0.7, 1.8, 0.9, 1.1),
    ("comp_doublefloor_front", 1.8, 0.0, 0.25, 1.6, 1.6, 0.35),
    ("comp_doublefloor_middle", -0.2, 0.0, 0.25, 2.2, 1.6, 0.35),
    ("comp_doublefloor_rear", -2.4, 0.0, 0.25, 1.8, 1.6, 0.35),
    ("comp_lounge_left", 1.5, 0.55, 0.6, 1.8, 0.5, 0.6),
    ("comp_lounge_side", 2.2, 0.3, 0.45, 0.5, 0.8, 0.5),
    ("comp_kitchen_upper", 0.3, -0.5, 1.7, 1.8, 0.3, 0.45),
    ("comp_kitchen_lower", 0.3, -0.55, 0.65, 1.8, 0.55, 0.75),
    ("comp_kitchen_fridge", 0.8, -0.45, 1.0, 0.6, 0.55, 1.5),
    ("comp_bathroom_sink", -0.6, 0.5, 0.9, 0.7, 0.4, 0.6),
    ("comp_bathroom_storage", -0.6, 0.5, 1.7, 0.7, 0.4, 0.5),
    ("comp_bed_wardrobe_left", -2.6, 0.55, 1.3, 1.7, 0.3, 1.7),
    ("comp_bed_wardrobe_right", -2.6, -0.55, 1.3, 1.7, 0.3, 1.7),
    ("comp_bed_drawer", -2.6, 0.0, 0.35, 1.7, 1.2, 0.35),
    ("comp_overhead_bed", -2.6, 0.0, 2.2, 1.7, 1.0, 0.35),
]

for name, x, y, z, w, d, h in compartments:
    obj = create_box(name, x, y, z, w, d, h, "compartment")
    # Add custom property for identification
    obj["is_compartment"] = True

# Lights
# Key sun light
bpy.ops.object.light_add(type='SUN', location=(5, 5, 8))
sun = bpy.context.active_object
sun.data.energy = 4.0
sun.rotation_euler = (math.radians(50), 0, math.radians(45))

# Fill light
bpy.ops.object.light_add(type='AREA', location=(0, -3, 3))
fill = bpy.context.active_object
fill.data.energy = 2.0
fill.rotation_euler = (math.radians(45), 0, 0)

# Interior ambient point
bpy.ops.object.light_add(type='POINT', location=(0, 0, 2.0))
point = bpy.context.active_object
point.data.energy = 500
point.data.color = (1.0, 0.95, 0.9)

# Camera
bpy.ops.object.camera_add(location=(6, 4, 4.5))
cam = bpy.context.active_object
cam.rotation_euler = (math.radians(55), 0, math.radians(145))
scene.camera = cam

# Export glb
output_path = os.path.join(os.path.dirname(bpy.data.filepath), "..", "web", "public", "models", "c2-tourer.glb")
# If run from command line, filepath may be empty; use absolute path
if not bpy.data.filepath:
    output_path = "/Users/danielfaludi/carthago-c2-tourer-inventory/web/public/models/c2-tourer.glb"

bpy.ops.export_scene.gltf(
    filepath=output_path,
    export_format='GLB',
    export_yup=True,
    export_apply=True,
    export_materials='EXPORT'
)

print(f"Exported model to {output_path}")
