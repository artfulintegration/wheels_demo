WheelsDevelopment::Application.routes.draw do
  resources :pages

  devise_for :users
  wheels_resources

  root :to => 'pages#show', :level1=>"Artful"

  match "/submit_feedback" => "feedbacks#new"
  match '/software' => 'product_revisions#index'
end

