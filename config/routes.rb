WheelsDevelopment::Application.routes.draw do
  devise_for :users
  wheels_resources

  root :to => 'pages#show', :level1=>"Welcome"

  match "/submit_feedback" => "feedbacks#new"
  match '/software' => 'product_revisions#index'
end
