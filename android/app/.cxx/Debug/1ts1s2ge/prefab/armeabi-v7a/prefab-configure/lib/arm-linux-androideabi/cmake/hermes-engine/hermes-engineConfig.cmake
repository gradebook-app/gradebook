if(NOT TARGET hermes-engine::libhermes)
add_library(hermes-engine::libhermes SHARED IMPORTED)
set_target_properties(hermes-engine::libhermes PROPERTIES
    IMPORTED_LOCATION "/Users/mahitmehta/.gradle/caches/transforms-3/5f36beb699a88afe9fa0372daa9d4dac/transformed/jetified-hermes-android-0.71.0-debug/prefab/modules/libhermes/libs/android.armeabi-v7a/libhermes.so"
    INTERFACE_INCLUDE_DIRECTORIES "/Users/mahitmehta/.gradle/caches/transforms-3/5f36beb699a88afe9fa0372daa9d4dac/transformed/jetified-hermes-android-0.71.0-debug/prefab/modules/libhermes/include"
    INTERFACE_LINK_LIBRARIES ""
)
endif()

