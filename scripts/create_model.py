import bpy
import os
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

# Vehicle dimensions
LENGTH = 7.36
WIDTH = 2.17
BODY_HEIGHT = 0.15

# Colors
COLOR_BODY = (0.96, 0.96, 0.96, 1.0)
COLOR_STRIPE = (0.35, 0.35, 0.38, 1.0)
COLOR_WINDOW = (0.5, 0.65, 0.78, 0.5)
COLOR_TIRE = (0.12, 0.12, 0.12, 1.0)
COLOR_RIM = (0.75, 0.75, 0.78, 1.0)
COLOR_MARKER = (0.90, 0.47, 0.35, 0.9)
COLOR_MARKER_HOVER = (0.98, 0.65, 0.55, 0.95)
COLOR_MARKER_SELECTED = (0.98, 0.30, 0.15, 0.95)
COLOR_GROUND = (0.93, 0.90, 0.84, 1.0)

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

make_material("body", COLOR_BODY, roughness=0.4)
make_material("stripe", COLOR_STRIPE, roughness=0.5)
make_material("window", COLOR_WINDOW, alpha=0.5, roughness=0.15)
make_material("tire", COLOR_TIRE, roughness=0.95)
make_material("rim", COLOR_RIM, metallic=0.7, roughness=0.25)
make_material("marker", COLOR_MARKER)
make_material("marker_hover", COLOR_MARKER_HOVER)
make_material("marker_selected", COLOR_MARKER_SELECTED)
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
create_plane("ground", 0, 0, -0.01, 18, 10, "ground")

# Main body - very flat slab
create_box("body_main", 0, 0, BODY_HEIGHT/2, LENGTH, WIDTH, BODY_HEIGHT, "body")

# Dark stripe along sides
create_box("stripe_left", 0, WIDTH/2 + 0.002, BODY_HEIGHT + 0.005, LENGTH - 0.4, 0.015, 0.08, "stripe")
create_box("stripe_right", 0, -WIDTH/2 - 0.002, BODY_HEIGHT + 0.005, LENGTH - 0.4, 0.015, 0.08, "stripe")

# Windows - flat, slightly above body, no overlap
# Front windshield
create_box("window_front", LENGTH/2 + 0.002, 0, BODY_HEIGHT + 0.05, 0.01, 1.6, 0.5, "window")
# Side windows
create_box("window_left_front", 1.3, WIDTH/2 + 0.002, BODY_HEIGHT + 0.05, 1.4, 0.01, 0.5, "window")
create_box("window_left_rear", -2.4, WIDTH/2 + 0.002, BODY_HEIGHT + 0.05, 2.0, 0.01, 0.5, "window")
create_box("window_right_front", 1.3, -WIDTH/2 - 0.002, BODY_HEIGHT + 0.05, 1.4, 0.01, 0.5, "window")
create_box("window_right_rear", -2.4, -WIDTH/2 - 0.002, BODY_HEIGHT + 0.05, 2.0, 0.01, 0.5, "window")

# Wheels - simple cylinders, clearly outside body
def create_wheel(x, y):
    bpy.ops.mesh.primitive_cylinder_add(radius=0.34, depth=0.2, location=(x, y, 0.34))
    wheel = bpy.context.active_object
    wheel.name = f"wheel_{x}_{y}"
    wheel.rotation_euler = (0, math.radians(90), 0)
    wheel.data.materials.append(materials["tire"])
    root_col.objects.link(wheel)
    bpy.context.scene.collection.objects.unlink(wheel)
    # rim
    bpy.ops.mesh.primitive_cylinder_add(radius=0.18, depth=0.22, location=(x, y, 0.34))
    rim = bpy.context.active_object
    rim.name = f"rim_{x}_{y}"
    rim.rotation_euler = (0, math.radians(90), 0)
    rim.data.materials.append(materials["rim"])
    root_col.objects.link(rim)
    bpy.context.scene.collection.objects.unlink(rim)

create_wheel(2.5, WIDTH/2 + 0.22)
create_wheel(2.5, -WIDTH/2 - 0.22)
create_wheel(-2.5, WIDTH/2 + 0.22)
create_wheel(-2.5, -WIDTH/2 - 0.22)

# Compartment markers - flat rectangles ON TOP of body, spaced out, no overlap
# Each marker is a thin slab sitting on top of body surface
compartments = [
    # Rear garage doors (back of vehicle)
    ("comp_heckgarage_links", -LENGTH/2 + 0.01, 0.42, BODY_HEIGHT + 0.012, 0.75, 0.75),
    ("comp_heckgarage_rechts", -LENGTH/2 + 0.01, -0.42, BODY_HEIGHT + 0.012, 0.75, 0.75),
    
    # Side flaps - left
    ("comp_seitenklappe_links_vorne", 2.1, WIDTH/2 - 0.25, BODY_HEIGHT + 0.012, 0.7, 0.45),
    ("comp_seitenklappe_links_mitte", -0.1, WIDTH/2 - 0.25, BODY_HEIGHT + 0.012, 1.0, 0.45),
    ("comp_seitenklappe_links_hinten", -2.4, WIDTH/2 - 0.25, BODY_HEIGHT + 0.012, 0.75, 0.45),
    
    # Side flaps - right
    ("comp_seitenklappe_rechts_vorne", 2.1, -WIDTH/2 + 0.25, BODY_HEIGHT + 0.012, 0.7, 0.45),
    ("comp_seitenklappe_rechts_mitte", -0.1, -WIDTH/2 + 0.25, BODY_HEIGHT + 0.012, 1.0, 0.45),
    ("comp_seitenklappe_rechts_hinten", -2.4, -WIDTH/2 + 0.25, BODY_HEIGHT + 0.012, 0.75, 0.45),
    
    # Roof hatch
    ("comp_dachklappe", -1.2, 0.0, BODY_HEIGHT + 0.012, 0.7, 0.5),
]

for name, x, y, z, w, d in compartments:
    obj = create_box(name, x, y, z, w, d, 0.006, "marker")
    obj["is_compartment"] = True

# Outline edges (thin boxes on top surface)
create_box("outline_front", LENGTH/2 - 0.02, 0, BODY_HEIGHT + 0.006, 0.02, WIDTH - 0.08, 0.006, "stripe")
create_box("outline_rear", -LENGTH/2 + 0.02, 0, BODY_HEIGHT + 0.006, 0.02, WIDTH - 0.08, 0.006, "stripe")
create_box("outline_left", 0, WIDTH/2 - 0.02, BODY_HEIGHT + 0.006, LENGTH - 0.08, 0.02, 0.006, "stripe")
create_box("outline_right", 0, -WIDTH/2 + 0.02, BODY_HEIGHT + 0.006, LENGTH - 0.08, 0.02, 0.006, "stripe")

# Lights
bpy.ops.object.light_add(type='SUN', location=(5, 5, 10))
sun = bpy.context.active_object
sun.data.energy = 3.0
sun.rotation_euler = (math.radians(50), 0, math.radians(45))

bpy.ops.object.light_add(type='AREA', location=(0, -5, 6))
fill = bpy.context.active_object
fill.data.energy = 2.0
fill.rotation_euler = (math.radians(45), 0, 0)

bpy.ops.object.light_add(type='POINT', location=(0, 0, 6))
ambient = bpy.context.active_object
ambient.data.energy = 600
ambient.data.color = (1.0, 0.98, 0.95)

# Camera - top down angled
cam_x = 1.5
cam_y = 9
cam_z = 12
bpy.ops.object.camera_add(location=(cam_x, cam_y, cam_z))
cam = bpy.context.active_object
cam.rotation_euler = (
    math.radians(35),
    0,
    math.radians(170),
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
