<?php

// Di-generate oleh php artisan template:zip - hanya berisi flavor "landing-katering".
// Ganti brand/warna di bawah, atau set TEMPLATE_FLAVOR di .env.

return [
    'flavor' => env('TEMPLATE_FLAVOR', 'landing-katering'),

    'flavors' => array (
  'landing-katering' => 
  array (
    'label' => 'SAJI RAYA CATERING — Katering',
    'brand_name' => 'SAJI RAYA CATERING',
    'brand_tagline' => 'Acaramu berkesan, sajiannya tak terlupakan',
    'brand_initials' => 'SR',
    'accent' => '#92400e',
    'category' => 'kuliner',
    'home' => 'landings.katering',
    'nav' => 
    array (
      'sections' => 
      array (
        0 => 
        array (
          'label' => 'Menu',
          'items' => 
          array (
            0 => 
            array (
              'label' => 'Landing',
              'to' => '/landings/katering',
              'icon' => 'Home',
            ),
            1 => 
            array (
              'label' => 'Dashboard',
              'to' => '/dashboard',
              'icon' => 'LayoutDashboard',
            ),
            2 => 
            array (
              'label' => 'Pengaturan',
              'to' => '/settings',
              'icon' => 'Settings',
            ),
          ),
        ),
      ),
    ),
  ),
),
];
