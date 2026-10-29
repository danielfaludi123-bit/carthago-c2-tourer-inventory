import bpy
import os
import math

# Clear default scene
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
HEIGHT = 2.40  # slightly lower for cleaner look
ROOF_HEIGHT = 2.95
WHEEL_RADIUS = 0.36
WHEEL_WIDTH = 0.22

# Colors
COLOR_BODY = (0.97, 0.97, 0.97, 1.0)
COLOR_WINDOW = (0.35, 0.45, 0.55, 0.55)
COLOR_TIRE = (0.15, 0.15, 0.15, 1.0)
COLOR_RIM = (0.7, 0.7, 0.75, 1.0)
COLOR_MARKER = (0.88, 0.48, 0.37, 1.0)  # terracotta
COLOR_MARKER_SELECTED = (0.95, 0.25, 0.15, 1.0)
COLOR_MARKER_HOVER = (0.95, 0.65, 0.5, 1.0)
COLOR_LINE = (0.6, 0.6, 0.6, 1.0)

materials = {}

def make_material(name, color, alpha=1.0, metallic=0.0, roughness=0.6):
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
make_material("window", COLOR_WINDOW, alpha=0.55, roughness=0.15)
make_material("tire", COLOR_TIRE, roughness=0.9)
make_material("rim", COLOR_RIM, metallic=0.8, roughness=0.2)
make_material("marker", COLOR_MARKER)
make_material("marker_selected", COLOR_MARKER_SELECTED)
make_material("marker_hover", COLOR_MARKER_HOVER)
make_material("line", COLOR_LINE)

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

# Main body lower part
create_box("body_lower", 0, 0, HEIGHT/2, LENGTH, WIDTH, HEIGHT, "body")

# Roof (slightly narrower and lower front for cab aerodynamics)
create_box("roof", 0, 0, HEIGHT + 0.25, LENGTH - 0.4, WIDTH - 0.12, 0.5, "body")

# Cab windshield (flat plane on front)
create_plane("windshield", LENGTH/2 + 0.005, 0, HEIGHT/2 + 0.25, 1.7, 0.9, "window", rotation=(0, math.radians(90), 0))

# Side windows (left and right) - as flat panels
# Left side windows
create_plane("window_side_left_front", 1.2, WIDTH/2 + 0.005, HEIGHT/2 + 0.1, 1.6, 0.7, "window", rotation=(math.radians(90), 0, math.radians(90)))
create_plane("window_side_left_rear", -2.5, WIDTH/2 + 0.005, HEIGHT/2 + 0.1, 2.0, 0.7, "window", rotation=(math.radians(90), 0, math.radians(90)))
# Right side windows
create_plane("window_side_right_front", 1.2, -WIDTH/2 - 0.005, HEIGHT/2 + 0.1, 1.6, 0.7, "window", rotation=(math.radians(90), 0, math.radians(90)))
create_plane("window_side_right_rear", -2.5, -WIDTH/2 - 0.005, HEIGHT/2 + 0.1, 2.0, 0.7, "window", rotation=(math.radians(90), 0, math.radians(90)))

# Wheels (simplified cylinders)
def create_wheel(x, y):
    bpy.ops.mesh.primitive_cylinder_add(radius=WHEEL_RADIUS, depth=WHEEL_WIDTH, location=(x, y, WHEEL_RADIUS))
    obj = bpy.context.active_object
    obj.name = f"wheel_{x}_{y}"
    obj.rotation_euler = (0, math.radians(90), 0)
    obj.data.materials.append(materials["tire"])
    root_col.objects.link(obj)
    bpy.context.scene.collection.objects.unlink(obj)
    # rim
    bpy.ops.mesh.primitive_cylinder_add(radius=WHEEL_RADIUS * 0.55, depth=WHEEL_WIDTH + 0.02, location=(x, y, WHEEL_RADIUS))
    rim = bpy.context.active_object
    rim.name = f"rim_{x}_{y}"
    rim.rotation_euler = (0, math.radians(90), 0)
    rim.data.materials.append(materials["rim"])
    root_col.objects.link(rim)
    bpy.context.scene.collection.objects.unlink(rim)

create_wheel(2.6, WIDTH/2 - 0.25)
create_wheel(2.6, -WIDTH/2 + 0.25)
create_wheel(-2.6, WIDTH/2 - 0.25)
create_wheel(-2.6, -WIDTH/2 + 0.25)

# Side stripe / line
create_plane("stripe_left", 0, WIDTH/2 + 0.008, 1.0, LENGTH - 0.6, 0.04, "line", rotation=(math.radians(90), 0, math.radians(90)))
create_plane("stripe_right", 0, -WIDTH/2 - 0.008, 1.0, LENGTH - 0.6, 0.04, "line", rotation=(math.radians(90), 0, math.radians(90)))

# Compartment markers - flat planes on the outside, NO collisions
# Format: (name, x, y, z, w, d, rotation)
compartments = [
    # Rear garage doors
    ("comp_heckgarage_links", -LENGTH/2 - 0.02, 0.35, 1.0, 0.9, 1.0, (0, math.radians(90), 0)),
    ("comp_heckgarage_rechts", -LENGTH/2 - 0.02, -0.35, 1.0, 0.9, 1.0, (0, math.radians(90), 0)),
    
    # Side compartment flaps (left side)
    ("comp_seitenklappe_links_vorne", 2.0, WIDTH/2 + 0.02, 0.5, 0.8, 0.55, (math.radians(90), 0, math.radians(90))),
    ("comp_seitenklappe_links_mitte", 0.0, WIDTH/2 + 0.02, 0.5, 1.1, 0.55, (math.radians(90), 0, math.radians(90))),
    ("comp_seitenklappe_links_hinten", -2.2, WIDTH/2 + 0.02, 0.5, 0.9, 0.55, (math.radians(90), 0, math.radians(90))),
    
    # Side compartment flaps (right side)
    ("comp_seitenklappe_rechts_vorne", 2.0, -WIDTH/2 - 0.02, 0.5, 0.8, 0.55, (math.radians(90), 0, math.radians(90))),
    ("comp_seitenklappe_rechts_mitte", 0.0, -WIDTH/2 - 0.02, 0.5, 1.1, 0.55, (math.radians(90), 0, math.radians(90))),
    ("comp_seitenklappe_rechts_hinten", -2.2, -WIDTH/2 - 0.02, 0.5, 0.9, 0.55, (math.radians(90), 0, math.radians(90))),
    
    # Roof / top access (optional)
    ("comp_dachklappe", -1.5, 0, HEIGHT + 0.51, 0.8, 0.6, (0, 0, 0)),
]

for name, x, y, z, w, d, rot in compartments:
    obj = create_plane(name, x, y, z, w, d, "marker", rotation=rot)
    obj["is_compartment"] = True
    # Add thin border frame using wireframe modifier? skip for simplicity

# Lights - bright and clean
bpy.ops.object.light_add(type='SUN', location=(8, 8, 12))
sun = bpy.context.active_object
sun.data.energy = 5.0
sun.rotation_euler = (math.radians(55), 0, math.radians(45))

bpy.ops.object.light_add(type='AREA', location=(0, -6, 6))
fill = bpy.context.active_object
fill.data.energy = 3.0
fill.rotation_euler = (math.radians(45), 0, 0)

# Ambient fill point light
bpy.ops.object.light_add(type='POINT', location=(0, 0, 8))
ambient = bpy.context.active_object
ambient.data.energy = 800
ambient.data.color = (1.0, 0.98, 0.95)

# Camera - angled from above
cam_x = 8
cam_y = 8
cam_z = 10
bpy.ops.object.camera_add(location=(cam_x, cam_y, cam_z))
cam = bpy.context.active_object
cam.rotation_euler = (
    math.radians(50),
    0,
    math.radians(135),
)
scene.camera = cam

# Ground plane (shadow catcher)
bpy.ops.mesh.primitive_plane_add(size=1, location=(0, 0, 0))
ground = bpy.context.active_object
ground.name = "ground"
ground.scale = (20, 20, 1)
make_material("ground", (0.92, 0.92, 0.92, 1.0), roughness=1.0)
ground.data.materials.append(materials["ground"])
root_col.objects.link(ground)
bpy.context.scene.collection.objects.unlink(ground)

# Export glb
output_path = "/Users/danielfaludi/carthago-c2-tourer-inventory/web/public/models/c2-tourer.glb"
bpy.ops.export_scene.gltf(
    filepath=output_path,
    export_format='GLB',
    export_yup=True,
    export_apply=True,
    export_materials='EXPORT'
)

print(f"Exported model to {output_path}")
