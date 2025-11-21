<template>
  <div class="p-6">
    <!-- Card Container -->
    <div class="bg-white shadow-base border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow" style="border-radius: var(--radius-lg)">
      <!-- Image Section -->
      <div class="bg-linear-to-br from-primary to-secondary h-48 flex items-center justify-center">
        <span class="text-white text-xl font-serif">Excursion Image</span>
      </div>

      <!-- Content Section -->
      <div class="p-6">
        <!-- Title -->
        <h2 class="text-xl font-serif text-text mb-2">Amazing Adventure Tour</h2>
        
        <!-- Description -->
        <p class="text-gray-600 text-sm mb-4">
          Discover breathtaking landscapes and unforgettable experiences with our curated excursions.
        </p>

        <!-- Info Grid -->
        <div class="grid grid-cols-2 gap-4 mb-6">
          <!-- Duration -->
          <div class="bg-bg p-3" style="border-radius: var(--radius-md)">
            <p class="text-xs text-gray-500 font-sans">Duration</p>
            <p class="text-lg font-sans font-semibold text-primary">4 hours</p>
          </div>
          
          <!-- Price -->
          <div class="bg-bg p-3" style="border-radius: var(--radius-md)">
            <p class="text-xs text-gray-500 font-sans">Price</p>
            <p class="text-lg font-sans font-semibold text-accent">$99</p>
          </div>
        </div>

        <!-- Tags -->
        <div class="flex gap-2 mb-6">
          <span class="bg-secondary/20 text-secondary text-xs px-3 py-1 rounded-full font-sans">Adventure</span>
          <span class="bg-accent/20 text-accent text-xs px-3 py-1 rounded-full font-sans">Outdoor</span>
        </div>

        <!-- Rating -->
        <div class="flex items-center mb-6">
          <div class="flex gap-1">
            <span class="text-accent">★★★★★</span>
          </div>
          <span class="text-xs text-gray-500 ml-2">(42 reviews)</span>
        </div>

        <!-- Action Buttons -->
        <div class="flex gap-3">
          <button class="flex-1 bg-primary text-white py-2 font-sans font-semibold hover:bg-blue-900 transition-colors shadow-lg hover:shadow-xl" style="border-radius: var(--radius-md)">
            View Details
          </button>
          <button class="flex-1 border-2 border-primary text-primary py-2 font-sans font-semibold hover:bg-primary hover:text-white transition-colors shadow-md hover:shadow-lg" style="border-radius: var(--radius-md)">
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
