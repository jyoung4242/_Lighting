#version 300 es
precision highp float;

in vec2 v_uv;
out vec4 fragColor;
uniform vec2 u_resolution;

// Point Light Uniforms
uniform vec2 uPointLightPositions[100];
uniform float uPointLightIntensities[100];
uniform float uPointLightFalloffs[100];
uniform vec3 uPointLightColors[100];
uniform int uPointLightCount;

// Ambient Light Uniforms
uniform vec2 uAmbientLightPositions[100];
uniform vec3 uAmbientLightColors[100];
uniform float uAmbientLightIntensities[100];
uniform int uAmbientLightCount;

const float EPSILON = 0.001; // Global EPSILON in UV space

// Textures
uniform sampler2D u_image;  // Default texture slot
uniform sampler2D uOccluderMasks[100];  // Slot 1 texture

// Occlusion Shader Uniforms
uniform vec2 uOccluderPosition[100];
uniform vec2 uOccluderSize[100];
uniform int uOccluderCount;

// Structure to represent an occluder
struct Occluder {
    vec2 position;
    vec2 size;
};

// Structure to represent a PointLight
struct PointLight {
    vec2 position;
    float intensity;
    float falloff;
    vec3 color;
};

// Structure to represent an AmbientLight
struct AmbientLight {
    vec3 color;
    float intensity;
    vec2 position;
};

float calculateShadow(vec2 point, vec2 lightPos, Occluder occluder, sampler2D occluderMask) {

    vec2 lightToPoint = point - lightPos;
    float rayLength = length(lightToPoint);
    vec2 rayDir = normalize(lightToPoint);
    
    float shadow = 1.0;
    const int MAX_STEPS = 64;  // Increased for better accuracy
    float stepSize = 1.0;      // Fixed step size in pixels
    
    vec2 currentPos = lightPos;
    float distanceTraveled = 0.0;
    
    // Continue marching until we reach the end point
    while(distanceTraveled < rayLength) {
        // Check if the current position intersects with occluder bounds
        vec2 relativePos = currentPos - occluder.position;
        vec2 normalizedPos = relativePos / occluder.size;
        
        // If we're inside the occluder bounds
        if (normalizedPos.x >= 0.0 && normalizedPos.x <= 1.0 && 
            normalizedPos.y >= 0.0 && normalizedPos.y <= 1.0) {
            
            vec4 occlusionSample = texture(occluderMask, normalizedPos);
            
            // If we hit an occluder, cast shadow along the remaining ray
            if (occlusionSample.r < 0.5) {
                shadow = 0.0;
                break;
            }
        }
        
        // March forward along the ray
        currentPos += rayDir * stepSize;
        distanceTraveled = length(currentPos - lightPos);
    }
    
    return shadow;
}


void main() {
    vec2 pixelCoord = v_uv * u_resolution;
    vec3 totalLight = vec3(0.0);


    // Process point lights
    for(int i = 0; i < uPointLightCount; i++) {
        PointLight light;
        light.position = uPointLightPositions[i];
        light.intensity = uPointLightIntensities[i];
        light.falloff = uPointLightFalloffs[i];
        light.color = uPointLightColors[i];
        
        float combinedShadow = 1.0;
        
        // Calculate shadows from all occluders for this light
        for(int j = 0; j < uOccluderCount; j++) {
            Occluder occluder;
            occluder.position = uOccluderPosition[j];
            occluder.size = uOccluderSize[j];
            
            float shadow = calculateShadow(pixelCoord, light.position, occluder, uOccluderMasks[j]);
            combinedShadow *= shadow; // Multiply shadows together for overlapping occluders
        }
        
        // Calculate point light contribution
        float distance = length(pixelCoord - light.position);
        float falloff = 1.0 / (1.0 + distance * light.falloff);
        vec3 pointLightContribution = light.color * falloff * combinedShadow * light.intensity;
        
        totalLight += pointLightContribution;
    }

    // Process ambient lights
    for(int i = 0; i < uAmbientLightCount; i++) {
        AmbientLight ambient;
        ambient.position = uAmbientLightPositions[i];
        ambient.color = uAmbientLightColors[i];
        ambient.intensity = uAmbientLightIntensities[i];
        
        // Simple ambient contribution - could be modified to have falloff or other effects
        totalLight += ambient.color * ambient.intensity;
    }
           
    vec4 textureColor = texture(u_image, v_uv);
    
    // Final color calculation
    vec3 finalColor = min(totalLight * textureColor.rgb, vec3(1.0));
    
    fragColor = vec4(finalColor, textureColor.a);
}